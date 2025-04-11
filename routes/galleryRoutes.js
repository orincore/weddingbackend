const express = require('express');
const router = express.Router();
const { getPhotos, getUserPhotos, getPhotoById } = require('../controllers/galleryController');

// Route: GET /api/gallery
router.get('/', getPhotos);

// Route: GET /api/gallery/user/:uploaderName
router.get('/user/:uploaderName', getUserPhotos);

// Route: GET /api/gallery/:id
router.get('/:id', getPhotoById);

module.exports = router; 