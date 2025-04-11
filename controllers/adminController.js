const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// Admin login
const adminLogin = (req, res) => {
  console.log('Login attempt - Request body:', req.body);
  console.log('Login attempt - Current session:', req.session);
  
  const { password } = req.body;
  
  // Check if the password matches
  if (password === process.env.ADMIN_PASSWORD) {
    // Set admin authentication in session
    req.session.adminAuth = true;
    
    // Save the session explicitly
    req.session.save((err) => {
      if (err) {
        console.error('Session save error during login:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to save session',
          error: err.message
        });
      }
      
      console.log('Login successful - Updated session:', req.session);
      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        session: req.session.id,
        adminAuth: req.session.adminAuth
      });
    });
  } else {
    console.log('Login failed - Invalid password');
    res.status(401).json({
      success: false,
      message: 'Invalid password',
    });
  }
};

// Admin logout
const adminLogout = (req, res) => {
  console.log('Logout attempt - Current session:', req.session);
  
  // Clear admin authentication from session
  req.session.adminAuth = false;
  
  // Save the session explicitly
  req.session.save((err) => {
    if (err) {
      console.error('Session save error during logout:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save session',
        error: err.message
      });
    }
    
    console.log('Logout successful - Updated session:', req.session);
    res.status(200).json({
      success: true,
      message: 'Admin logout successful',
      session: req.session.id,
      adminAuth: req.session.adminAuth
    });
  });
};

// Get all photos (admin view)
const getAllUploads = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ timestamp: -1 });

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

// Delete photo
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Delete photo from database
    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete photo',
      error: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getAllUploads,
  deletePhoto,
}; 
