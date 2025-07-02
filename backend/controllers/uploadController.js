const path = require('path');

// @desc    Upload user avatar
// @route   POST /api/uploads/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/users/${req.file.filename}`;
    res.status(200).json({ success: true, url: fileUrl });
};

// @desc    Upload salon image
// @route   POST /api/uploads/salon/:salonId
// @access  Private (Salon Owner)
exports.uploadSalonImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/salons/${req.file.filename}`;
    res.status(200).json({ success: true, url: fileUrl });
};

// @desc    Upload generic image
// @route   POST /api/uploads/image
// @access  Private
exports.uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/salons/${req.file.filename}`;
    res.status(200).json({ success: true, imageUrl: fileUrl });
};
