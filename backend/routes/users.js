const express = require('express');
const router = express.Router();
const {
    getMe,
    updateProfile,
    changePassword,
    getUserById,
    getAllUsers,
    deactivateAccount
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', protect, updateProfile);

// @route   PUT /api/users/change-password
// @desc    Change current user's password
// @access  Private
router.put('/change-password', protect, changePassword);

// @route   DELETE /api/users/me
// @desc    Deactivate (soft delete) current user's account
// @access  Private
router.delete('/me', protect, deactivateAccount);

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), getUserById);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router; 