const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/logout
router.post('/logout', protect, logout);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

module.exports = router; 