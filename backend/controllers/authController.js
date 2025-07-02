const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to send JWT in response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }
        user = await User.create({ name, email, password, role });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        user.lastLogin = new Date();
        await user.save();
        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    // For JWT, logout is handled on the client by deleting the token
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
}; 