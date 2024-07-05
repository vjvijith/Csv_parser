# Robust CSV API

This is a Node.js API for handling CSV uploads and processing.

## Features

- User authentication and authorization
- CSV file upload
- Asynchronous CSV processing using a job queue
- Storage of processed data in MongoDB
- Job status tracking

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Redis
- npm 

## Setup

1. Clone the repository
2. Run `npm install`
3. Set up your environment variables in a `.env` file
4. Run `npm start` to start the server

## Environment Variables

- Create a .env file in the root directory of your project with the following content:

1. env
2. Copy code
3. PORT=3000
4. MONGO_URI=mongodb://localhost:27017/csv-file-upload || mongodb+srv://               <username>:<password>@cluster0.f5xvk3i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
5. REDIS_URL=redis://localhost:6379
6. JWT_SECRET=your_jwt_secret

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Log in a user
- POST /api/csv/upload - Upload a CSV file
    - Headers: Authorization: Bearer <token>
    - Form Data: file:<file>
- GET /api/csv/status/:jobId - Get the status of a CSV processing job
    - Headers: Authorization: Bearer <token>

## Authentication

Use the JWT token generated upon user login to access the protected routes. Include the token in the Authorization header as follows:
- Authorization: Bearer <your_jwt_token>

## Running Tests

Run `npm test` to execute the test suite.

## Error Handling

Errors are handled gracefully, and appropriate HTTP status codes and messages are returned to the client. Common error responses include:

- 401 Unauthorized for authentication errors.
- 404 Not Found for missing resources.
- 500 Internal Server Error for server-side issues.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the ISC License.

## Deployment

[Include deployment instructions here]
