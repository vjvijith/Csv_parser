const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const CsvData = require('../models/CsvData');

const processCSV = (filePath, userId, jobId) => {
  return new Promise(async (resolve, reject) => {
    console.log('Processing CSV at path:', filePath);
    console.log('For user:', userId);
    console.log('Job ID:', jobId);

    const absoluteFilePath = path.resolve(filePath);
    console.log('Absolute file path:', absoluteFilePath);

    try {
      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
      }

      // Verify if the file exists before processing
      if (!fs.existsSync(absoluteFilePath)) {
        throw new Error('File does not exist');
      }

      const results = [];
      const csvStream = fs.createReadStream(absoluteFilePath).pipe(csv());

      for await (const row of csvStream) {
        try {
          results.push({
            index: row['Index'],
            customerId: row['Customer Id'],
            firstName: row['First Name'],
            lastName: row['Last Name'],
            company: row['Company'],
            city: row['City'],
            country: row['Country'],
            phone1: row['Phone 1'],
            phone2: row['Phone 2'],
            email: row['Email'],
            subscriptionDate: row['Subscription Date'],
            website: row['Website'],
            userId: userId,
            jobId: jobId,
            status: 'completed'
          });
        } catch (error) {
          console.error('Error processing row:', error);
        }
      }

      console.log('CSV processing completed. Inserting data into MongoDB.');
      await CsvData.insertMany(results);
      console.log('Data inserted successfully.');
      
      fs.unlinkSync(absoluteFilePath); // Delete the file after processing
      resolve();
    } catch (error) {
      console.error('Error processing CSV:', error);
      await CsvData.updateMany({ jobId }, { status: 'failed', error: error.message });
      reject(error);
    }
  });
};

module.exports = { processCsv: processCSV };