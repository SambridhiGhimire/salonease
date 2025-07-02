const express = require('express');
const router = express.Router();
const {
    createBooking,
    updateBooking,
    getBookingById,
    getBookingsByUser,
    getBookingsBySalon,
    getBookingsByCurrentSalon,
    cancelBooking,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User)
router.post('/', protect, authorize('user'), createBooking);

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private (User/Salon Owner/Admin)
router.put('/:id', protect, updateBooking);

// @route   GET /api/bookings/user
// @desc    List bookings for a user
// @access  Private (User)
router.get('/user', protect, authorize('user'), getBookingsByUser);

// @route   GET /api/bookings/salon
// @desc    List bookings for current salon owner
// @access  Private (Salon Owner)
router.get('/salon', protect, authorize('salon_owner'), getBookingsByCurrentSalon);

// @route   GET /api/bookings/salon/:salonId
// @desc    List bookings for a salon
// @access  Private (Salon Owner/Admin)
router.get('/salon/:salonId', protect, authorize('salon_owner', 'admin'), getBookingsBySalon);

// @route   GET /api/bookings/:id
// @desc    Get a single booking by ID
// @access  Private (User/Salon Owner/Admin)
router.get('/:id', protect, getBookingById);

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private (User/Salon Owner/Admin)
router.delete('/:id', protect, cancelBooking);

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status (confirm, complete, etc.)
// @access  Private (Salon Owner/Admin)
router.patch('/:id/status', protect, authorize('salon_owner', 'admin'), updateBookingStatus);

module.exports = router; 