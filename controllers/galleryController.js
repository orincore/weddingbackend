const Photo = require('../models/Photo');

// Get all photos
const getPhotos = async (req, res) => {
  try {
    const { name } = req.query;
    let filter = {};

    // Apply name filter if provided
    if (name) {
      filter.uploaderName = { $regex: name, $options: 'i' };
    }

    const photos = await Photo.find(filter).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch photos',
      error: error.message,
    });
  }
};

// Get photos by exact uploader name
const getUserPhotos = async (req, res) => {
  try {
    const { uploaderName } = req.params;
    
    if (!uploaderName) {
      return res.status(400).json({
        success: false,
        message: 'Uploader name is required',
      });
    }

    const photos = await Photo.find({ 
      uploaderName: uploaderName 
    }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.error('Error fetching user photos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user photos',
      error: error.message,
    });
  }
};

// Get single photo by ID
const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    res.status(200).json({
      success: true,
      photo,
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch photo',
      error: error.message,
    });
  }
};

module.exports = {
  getPhotos,
  getUserPhotos,
  getPhotoById,
}; 