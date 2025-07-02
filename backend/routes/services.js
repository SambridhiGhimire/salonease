const express = require('express');
const router = express.Router();
const {
    createService,
    updateService,
    getServiceById,
    getServicesBySalon,
    getServicesByCurrentSalon,
    deleteService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/services
// @desc    Add a new service
// @access  Private (Salon Owner)
router.post('/', protect, authorize('salon_owner'), createService);

// @route   PUT /api/services/:id
// @desc    Update service details
// @access  Private (Salon Owner)
router.put('/:id', protect, authorize('salon_owner'), updateService);

// @route   GET /api/services/salon
// @desc    List services for current salon owner
// @access  Private (Salon Owner)
router.get('/salon', protect, authorize('salon_owner'), getServicesByCurrentSalon);

// @route   GET /api/services/salon/:salonId
// @desc    List services by salon
// @access  Public
router.get('/salon/:salonId', getServicesBySalon);

// @route   GET /api/services/:id
// @desc    Get a single service by ID
// @access  Public
router.get('/:id', getServiceById);

// @route   DELETE /api/services/:id
// @desc    Delete (soft delete) a service
// @access  Private (Salon Owner)
router.delete('/:id', protect, authorize('salon_owner'), deleteService);

module.exports = router; 