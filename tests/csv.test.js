const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const CsvData = require('../models/CsvData');

let authToken;
const testUser = {
  email: 'test@example.com',
  password: 'password@123',
  name: 'Test User'
};

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

beforeAll(async () => {
  jest.setTimeout(30000); // Increase global timeout to 30 seconds
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await CsvData.deleteMany({});
  
  const user = await User.create(testUser);
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: testUser.email, password: testUser.password });

  authToken = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('CSV Upload and Processing', () => {
  it('should upload a CSV file successfully', async () => {
    const response = await request(app)
      .post('/api/csv/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', 'tests/test-data/test.csv');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('jobId');
  }, 20000);

  it('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/api/csv/upload')
      .attach('file', 'tests/test-data/test.csv');

    expect(response.statusCode).toBe(401);
  });

  it('should get the status of a processing job', async () => {
    const uploadResponse = await request(app)
      .post('/api/csv/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', 'tests/test-data/test.csv');

    expect(uploadResponse.statusCode).toBe(201);
    const jobId = uploadResponse.body.jobId;

    // Add a delay to allow processing to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    const statusResponse = await request(app)
      .get(`/api/csv/status/${jobId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body).toHaveProperty('status');
  }, 30000);
});