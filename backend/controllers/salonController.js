const Salon = require('../models/Salon');
const User = require('../models/User');

// @desc    Register a new salon
// @route   POST /api/salons
// @access  Private (Salon Owner)
exports.createSalon = async (req, res, next) => {
    try {
        // Only allow salon_owner to create
        if (req.user.role !== 'salon_owner') {
            return res.status(403).json({ success: false, message: 'Only salon owners can register a salon.' });
        }
        // Prevent duplicate salon for same owner
        const existing = await Salon.findOne({ owner: req.user.id });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You already have a registered salon.' });
        }
        const salon = await Salon.create({ ...req.body, owner: req.user.id });
        res.status(201).json({ success: true, salon });
    } catch (err) {
        next(err);
    }
};

// @desc    Update salon details
// @route   PUT /api/salons/:id
// @access  Private (Salon Owner/Admin)
exports.updateSalon = async (req, res, next) => {
    try {
        let salon = await Salon.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }
        // Only owner or admin can update
        if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // Prevent owner change
        delete req.body.owner;
        salon = await Salon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, salon });
    } catch (err) {
        next(err);
    }
};

// @desc    Get a single salon by ID
// @route   GET /api/salons/:id
// @access  Public
exports.getSalonById = async (req, res, next) => {
    try {
        const salon = await Salon.findById(req.params.id).populate('owner', 'name email avatar');
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }
        res.status(200).json({ success: true, salon });
    } catch (err) {
        next(err);
    }
};

// @desc    List all salons (with filters)
// @route   GET /api/salons
// @access  Public
exports.getAllSalons = async (req, res, next) => {
    try {
        const query = {}; // Removed isVerified filter temporarily
        if (req.query.city) query['address.city'] = req.query.city;
        if (req.query.state) query['address.state'] = req.query.state;
        if (req.query.category) query.category = req.query.category;
        if (req.query.isFeatured) query.isFeatured = req.query.isFeatured === 'true';
        // Add more filters as needed
        const salons = await Salon.find(query).populate('owner', 'name email avatar');
        res.status(200).json({ success: true, salons });
    } catch (err) {
        next(err);
    }
};

// @desc    Get salon by owner (current user)
// @route   GET /api/salons/owner
// @access  Private (Salon Owner)
exports.getSalonByOwner = async (req, res, next) => {
    try {
        const salon = await Salon.findOne({ owner: req.user.id }).populate('owner', 'name email avatar');
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found for this owner' });
        }
        res.status(200).json({ success: true, salon });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete (soft delete) a salon
// @route   DELETE /api/salons/:id
// @access  Private (Salon Owner/Admin)
exports.deleteSalon = async (req, res, next) => {
    try {
        const salon = await Salon.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }
        // Only owner or admin can delete
        if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        salon.isActive = false;
        await salon.save();
        res.status(200).json({ success: true, message: 'Salon deleted (soft delete).' });
    } catch (err) {
        next(err);
    }
};
