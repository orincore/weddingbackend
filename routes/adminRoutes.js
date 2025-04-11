const express = require('express');
const router = express.Router();
const { adminLogin, adminLogout, getAllUploads, deletePhoto } = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/authMiddleware');

// Route: POST /api/admin/login
router.post('/login', adminLogin);

// Route: POST /api/admin/logout
router.post('/logout', adminLogout);

// Route: GET /api/admin/uploads
router.get('/uploads', isAdmin, getAllUploads);

// Route: DELETE /api/admin/delete/:id
router.delete('/delete/:id', isAdmin, deletePhoto);

module.exports = router; 