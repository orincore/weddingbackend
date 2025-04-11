const express = require('express');
const router = express.Router();
const { uploadPhoto } = require('../controllers/uploadController');
const upload = require('../middlewares/uploadMiddleware');

// Route: POST /api/upload - with file upload
router.post('/', upload.single('photo'), uploadPhoto);

// Route: POST /api/upload/base64 - with base64 image data
router.post('/base64', uploadPhoto);

module.exports = router; 