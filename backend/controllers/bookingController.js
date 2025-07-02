const Booking = require('../models/Booking');
const Salon = require('../models/Salon');
const Service = require('../models/Service');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
    try {
        const { salon, service, appointmentDate, startTime, endTime, duration, totalAmount, currency, staff, customerNotes } = req.body;
        // Validate salon and service
        const foundSalon = await Salon.findById(salon);
        if (!foundSalon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }
        const foundService = await Service.findById(service);
        if (!foundService) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        // Create booking
        const booking = await Booking.create({
            customer: req.user.id,
            salon,
            service,
            appointmentDate,
            startTime,
            endTime,
            duration,
            totalAmount,
            currency,
            staff,
            customerNotes
        });
        res.status(201).json({ success: true, booking });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private (User/Salon Owner/Admin)
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Only customer, salon owner, or admin can update
        if (
            booking.customer.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            // Check if user is salon owner
            const salon = await Salon.findById(booking.salon);
            if (!salon || salon.owner.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
        }
        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, booking });
    } catch (err) {
        next(err);
    }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (User/Salon Owner/Admin)
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('salon', 'name')
            .populate('service', 'name');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Only customer, salon owner, or admin can view
        if (
            booking.customer._id.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            // Check if user is salon owner
            const salon = await Salon.findById(booking.salon._id);
            if (!salon || salon.owner.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
        }
        res.status(200).json({ success: true, booking });
    } catch (err) {
        next(err);
    }
};

// @desc    List bookings for a user
// @route   GET /api/bookings/user
// @access  Private (User)
exports.getBookingsByUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id })
            .populate('salon', 'name')
            .populate('service', 'name');
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    List bookings for a salon
// @route   GET /api/bookings/salon/:salonId
// @access  Private (Salon Owner/Admin)
exports.getBookingsBySalon = async (req, res, next) => {
    try {
        const salon = await Salon.findById(req.params.salonId);
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }
        // Only salon owner or admin can view
        if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const bookings = await Booking.find({ salon: req.params.salonId })
            .populate('customer', 'name email')
            .populate('service', 'name');
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    List bookings for current salon owner
// @route   GET /api/bookings/salon
// @access  Private (Salon Owner)
exports.getBookingsByCurrentSalon = async (req, res, next) => {
    try {
        // Find the salon owned by current user
        const salon = await Salon.findOne({ owner: req.user.id });
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found for this owner' });
        }
        const bookings = await Booking.find({ salon: salon._id })
            .populate('customer', 'name email')
            .populate('service', 'name');
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private (User/Salon Owner/Admin)
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Only customer, salon owner, or admin can cancel
        if (
            booking.customer.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            // Check if user is salon owner
            const salon = await Salon.findById(booking.salon);
            if (!salon || salon.owner.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
        }
        booking.status = 'cancelled';
        booking.cancellationDate = new Date();
        booking.cancelledBy = req.user.role;
        await booking.save();
        res.status(200).json({ success: true, message: 'Booking cancelled.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Update booking status (confirm, complete, etc.)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Salon Owner/Admin)
exports.updateBookingStatus = async (req, res, next) => {
    try {
        let status = req.body.status;
        // If status is an object (e.g., { status: 'confirmed' }), extract the value
        if (typeof status === 'object' && status !== null && 'status' in status) {
            status = status.status;
        }
        const booking = await Booking.findById(req.params.id).populate('salon');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Only salon owner or admin can update status
        if (booking.salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (typeof status !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        booking.status = status;
        await booking.save();
        res.status(200).json({ success: true, booking });
    } catch (err) {
        next(err);
    }
}; 