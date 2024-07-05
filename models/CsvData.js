const mongoose = require('mongoose');

const CsvDataSchema = new mongoose.Schema({
  index: Number,
  customerId: String,
  firstName: String,
  lastName: String,
  company: String,
  city: String,
  country: String,
  phone1: String,
  phone2: String,
  email: String,
  subscriptionDate: Date,
  website: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' }
});

const CsvData = mongoose.model('CsvData', CsvDataSchema);
module.exports = CsvData;
