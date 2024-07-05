const fileQueue = require('../utils/queue');
const CsvData = require('../models/CsvData');

exports.uploadFile = async (req, res) => {
  const file = req.file;
  console.log(file);
  try {
    console.log("Caught inside here");
    const job = await fileQueue.addJob('processCSV', { path: file.path, userId: req.user._id });
    res.status(201).json({ message: 'File uploaded successfully', job,jobId: job.id });
  } catch (error) {
    console.error('File upload failed:', error);
    res.status(500).send({ error: 'File upload failed' });
  }
};

exports.getFileStatus = async (req, res) => {
  const { jobId } = req.params;
  try {
    const fileStatus = await CsvData.findOne({ jobId });
    if (!fileStatus) {
      return res.status(404).send({ error: 'No data found' });
    }
    res.status(200).json({ status: fileStatus.status });
  } catch (error) {
    console.error('Failed to get file status:', error);
    res.status(404).send({ error: 'Failed to get file status' });
  }
};
