const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Photo = require('../models/Photo');

// Upload photo controller
const uploadPhoto = async (req, res) => {
  try {
    const { uploaderName, imageData } = req.body;

    if (!uploaderName) {
      return res.status(400).json({ message: 'Guest name is required' });
    }

    let result;

    // Handle base64 image data from camera
    if (imageData) {
      result = await cloudinary.uploader.upload(imageData, {
        folder: 'wedding-photos',
      });
    } 
    // Handle file upload
    else if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'wedding-photos',
      });

      // Remove file from server after upload
      fs.unlinkSync(req.file.path);
    } else {
      return res.status(400).json({ message: 'No image provided' });
    }


    // Create new photo in database
    const photo = await Photo.create({
      url: result.secure_url,
      publicId: result.public_id,
      uploaderName,
    });

    res.status(201).json({
      success: true,
      photo,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo',
      error: error.message,
    });
  }
};

module.exports = {
  uploadPhoto,
}; 