const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = { ...req.body };
        // Prevent role/email change unless explicitly allowed
        delete fieldsToUpdate.role;
        delete fieldsToUpdate.email;
        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// @desc    Change current user's password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};

// @desc    Deactivate (soft delete) current user's account
// @route   DELETE /api/users/me
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { isActive: false });
        res.status(200).json({ success: true, message: 'Account deactivated.' });
    } catch (err) {
        next(err);
    }
};
