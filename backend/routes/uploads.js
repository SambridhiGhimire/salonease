const express = require('express');
const router = express.Router();
const { uploadAvatar, uploadSalonImage, uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/uploads/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', protect, upload.uploadAvatar.single('avatar'), uploadAvatar);

// @route   POST /api/uploads/salon/:salonId
// @desc    Upload salon image
// @access  Private (Salon Owner)
router.post('/salon/:salonId', protect, authorize('salon_owner', 'admin'), upload.uploadSalonImage.single('image'), uploadSalonImage);

// @route   POST /api/uploads/image
// @desc    Upload generic image
// @access  Private
router.post('/image', protect, upload.uploadSalonImage.single('image'), uploadImage);

module.exports = router; 