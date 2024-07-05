const Queue = require('bull');
const mongoose = require('mongoose');
const CsvData = require('../models/CsvData');
const { processCsv } = require('./csvProcessor');
// Create a new queue
const fileQueue = new Queue('fileProcessing', process.env.REDIS_URL);

fileQueue.process('processCSV', async (job) => {
  console.log('Processing job:', job.id);
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
    }

    const { path, userId } = job.data;

    // Check if job has already been processed
    const existingJob = await CsvData.findOne({ jobId: job.id, status: 'completed' });
    if (existingJob) {
      console.log(`Job ${job.id} has already been processed.`);
      return;
    }

    await processCsv(path, userId, job.id);
    await CsvData.updateMany({ jobId: job.id }, { status: 'completed' });
  } catch (error) {
    console.error('Job processing failed:', error);
    await CsvData.updateMany({ jobId: job.id }, { status: 'failed', error: error.message });
    throw error; // Rethrow the error to mark the job as failed in Bull
  }
});

fileQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

fileQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

const addJob = (jobName, data) => {
  return fileQueue.add(jobName, data);
};

module.exports = {
  addJob,
  fileQueue
};
