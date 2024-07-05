const express = require('express');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { uploadFile, getFileStatus } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/isAuth');

const router = express.Router();

router
    .route('/upload')
    .post(authMiddleware, uploadMiddleware, uploadFile);

router
    .route('/status/:jobId')
    .get( authMiddleware, getFileStatus);

module.exports = router;
