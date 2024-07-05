const mongoose = require('mongoose');

const fileStatusSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'failed'], default: 'pending' },
  error: { type: String, default: null },
});

module.exports = mongoose.model('FileStatus', fileStatusSchema);
