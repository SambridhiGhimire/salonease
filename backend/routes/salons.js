const express = require('express');
const router = express.Router();
const {
    createSalon,
    updateSalon,
    getSalonById,
    getAllSalons,
    deleteSalon,
    getSalonByOwner
} = require('../controllers/salonController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/salons
// @desc    Register a new salon
// @access  Private (Salon Owner)
router.post('/', protect, authorize('salon_owner'), createSalon);

// @route   GET /api/salons/owner
// @desc    Get salon by current owner
// @access  Private (Salon Owner)
router.get('/owner', protect, authorize('salon_owner'), getSalonByOwner);

// @route   PUT /api/salons/:id
// @desc    Update salon details
// @access  Private (Salon Owner/Admin)
router.put('/:id', protect, authorize('salon_owner', 'admin'), updateSalon);

// @route   GET /api/salons/:id
// @desc    Get a single salon by ID
// @access  Public
router.get('/:id', getSalonById);

// @route   GET /api/salons
// @desc    List all salons (with filters)
// @access  Public
router.get('/', getAllSalons);

// @route   DELETE /api/salons/:id
// @desc    Delete (soft delete) a salon
// @access  Private (Salon Owner/Admin)
router.delete('/:id', protect, authorize('salon_owner', 'admin'), deleteSalon);

module.exports = router; 