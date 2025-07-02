const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Salon = require('../models/Salon');
const Service = require('../models/Service');

// Review schema is embedded in Booking, but for listing, we query Bookings with review fields

// @desc    Add a review (for a completed booking)
// @route   POST /api/reviews
// @access  Private (User)
exports.addReview = async (req, res, next) => {
    try {
        const { bookingId, rating, review } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (booking.status !== 'completed') {
            return res.status(400).json({ success: false, message: 'You can only review completed bookings.' });
        }
        if (booking.review) {
            return res.status(400).json({ success: false, message: 'Review already exists for this booking.' });
        }
        booking.rating = rating;
        booking.review = review;
        booking.reviewDate = new Date();
        await booking.save();
        // Update salon and service ratings
        await Salon.findByIdAndUpdate(booking.salon, { $inc: { 'rating.count': 1 }, $set: { 'rating.average': rating } });
        await Service.findByIdAndUpdate(booking.service, { $inc: { 'reviews.count': 1 }, $set: { 'reviews.average': rating } });
        res.status(201).json({ success: true, message: 'Review added.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a review (user can update their own review)
// @route   PUT /api/reviews/:bookingId
// @access  Private (User)
exports.updateReview = async (req, res, next) => {
    try {
        const { rating, review } = req.body;
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (!booking.review) {
            return res.status(400).json({ success: false, message: 'No review to update.' });
        }
        booking.rating = rating;
        booking.review = review;
        booking.reviewDate = new Date();
        await booking.save();
        res.status(200).json({ success: true, message: 'Review updated.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a review (user or admin)
// @route   DELETE /api/reviews/:bookingId
// @access  Private (User/Admin)
exports.deleteReview = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (
            booking.customer.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        booking.rating = undefined;
        booking.review = undefined;
        booking.reviewDate = undefined;
        await booking.save();
        res.status(200).json({ success: true, message: 'Review deleted.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get reviews for a salon
// @route   GET /api/reviews/salon/:salonId
// @access  Public
exports.getReviewsForSalon = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ salon: req.params.salonId, review: { $exists: true, $ne: null } })
            .populate('customer', 'name avatar')
            .select('rating review reviewDate customer');
        res.status(200).json({ success: true, reviews: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
exports.getReviewsForService = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ service: req.params.serviceId, review: { $exists: true, $ne: null } })
            .populate('customer', 'name avatar')
            .select('rating review reviewDate customer');
        res.status(200).json({ success: true, reviews: bookings });
    } catch (err) {
        next(err);
    }
}; 