const express = require('express');
const router = express.Router();
const {
    addReview,
    updateReview,
    deleteReview,
    getReviewsForSalon,
    getReviewsForService
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Add a review (for a completed booking)
// @access  Private (User)
router.post('/', protect, authorize('user'), addReview);

// @route   PUT /api/reviews/:bookingId
// @desc    Update a review (user can update their own review)
// @access  Private (User)
router.put('/:bookingId', protect, authorize('user'), updateReview);

// @route   DELETE /api/reviews/:bookingId
// @desc    Delete a review (user or admin)
// @access  Private (User/Admin)
router.delete('/:bookingId', protect, deleteReview);

// @route   GET /api/reviews/salon/:salonId
// @desc    Get reviews for a salon
// @access  Public
router.get('/salon/:salonId', getReviewsForSalon);

// @route   GET /api/reviews/service/:serviceId
// @desc    Get reviews for a service
// @access  Public
router.get('/service/:serviceId', getReviewsForService);

module.exports = router; 