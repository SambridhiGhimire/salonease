const Service = require('../models/Service');
const Salon = require('../models/Salon');

// @desc    Add a new service
// @route   POST /api/services
// @access  Private (Salon Owner)
exports.createService = async (req, res, next) => {
    try {
        // Only allow salon_owner to create
        if (req.user.role !== 'salon_owner') {
            return res.status(403).json({ success: false, message: 'Only salon owners can add services.' });
        }
        // Verify salon ownership
        const salon = await Salon.findOne({ owner: req.user.id });
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found for this owner.' });
        }
        const service = await Service.create({ ...req.body, salon: salon._id });
        res.status(201).json({ success: true, service });
    } catch (err) {
        next(err);
    }
};

// @desc    Update service details
// @route   PUT /api/services/:id
// @access  Private (Salon Owner)
exports.updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id).populate('salon');
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        // Only salon owner can update
        if (service.salon.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, service });
    } catch (err) {
        next(err);
    }
};

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate('salon', 'name address');
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.status(200).json({ success: true, service });
    } catch (err) {
        next(err);
    }
};

// @desc    List services by salon
// @route   GET /api/services/salon/:salonId
// @access  Public
exports.getServicesBySalon = async (req, res, next) => {
    try {
        const services = await Service.find({ salon: req.params.salonId, isActive: true });
        res.status(200).json({ success: true, services });
    } catch (err) {
        next(err);
    }
};

// @desc    List services for current salon owner
// @route   GET /api/services/salon
// @access  Private (Salon Owner)
exports.getServicesByCurrentSalon = async (req, res, next) => {
    try {
        // Find the salon owned by current user
        const salon = await Salon.findOne({ owner: req.user.id });
        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found for this owner' });
        }
        const services = await Service.find({ salon: salon._id });
        res.status(200).json({ success: true, services });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete (soft delete) a service
// @route   DELETE /api/services/:id
// @access  Private (Salon Owner)
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate('salon');
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        // Only salon owner can delete
        if (service.salon.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        service.isActive = false;
        await service.save();
        res.status(200).json({ success: true, message: 'Service deleted (soft delete).' });
    } catch (err) {
        next(err);
    }
}; 