const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a service name'],
        trim: true,
        maxlength: [100, 'Service name cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        enum: ['hair', 'nail', 'spa', 'massage', 'beauty', 'barber', 'wellness', 'other'],
        required: true
    },
    subcategory: {
        type: String,
        enum: ['haircut', 'coloring', 'styling', 'manicure', 'pedicure', 'facial', 'massage', 'waxing', 'makeup', 'eyebrows', 'lashes', 'other'],
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD'
    },
    duration: {
        type: Number,
        required: [true, 'Please provide service duration'],
        min: [5, 'Duration must be at least 5 minutes']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: null
    },
    requirements: [{
        type: String,
        enum: ['consultation', 'patch_test', 'preparation', 'aftercare', 'other']
    }],
    preparation: {
        type: String,
        maxlength: [500, 'Preparation instructions cannot be more than 500 characters']
    },
    aftercare: {
        type: String,
        maxlength: [500, 'Aftercare instructions cannot be more than 500 characters']
    },
    cancellationPolicy: {
        type: String,
        enum: ['flexible', 'moderate', 'strict'],
        default: 'moderate'
    },
    cancellationHours: {
        type: Number,
        default: 24
    },
    maxAdvanceBookingDays: {
        type: Number,
        default: 30
    },
    minAdvanceBookingHours: {
        type: Number,
        default: 2
    },
    capacity: {
        type: Number,
        default: 1,
        min: [1, 'Capacity must be at least 1']
    },
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    availability: {
        monday: { type: Boolean, default: true },
        tuesday: { type: Boolean, default: true },
        wednesday: { type: Boolean, default: true },
        thursday: { type: Boolean, default: true },
        friday: { type: Boolean, default: true },
        saturday: { type: Boolean, default: true },
        sunday: { type: Boolean, default: true }
    },
    timeSlots: [{
        startTime: String,
        endTime: String
    }],
    addOns: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        duration: {
            type: Number,
            default: 0
        },
        description: String
    }],
    packages: [{
        name: {
            type: String,
            required: true
        },
        services: [{
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Service'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        totalPrice: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        description: String
    }],
    reviews: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ salon: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ subcategory: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isPopular: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ 'reviews.average': -1 });

// Virtual for discounted price (if any)
serviceSchema.virtual('discountedPrice').get(function () {
    return this.price;
});

// Virtual for formatted duration
serviceSchema.virtual('formattedDuration').get(function () {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}m`;
    }
});

// Method to update service rating
serviceSchema.methods.updateRating = function (newRating) {
    const totalRating = this.reviews.average * this.reviews.count + newRating;
    this.reviews.count += 1;
    this.reviews.average = totalRating / this.reviews.count;
    return this.save();
};

// Method to check if service is available on a specific day
serviceSchema.methods.isAvailableOnDay = function (day) {
    return this.availability[day.toLowerCase()] || false;
};

// Method to get available time slots for a specific day
serviceSchema.methods.getAvailableTimeSlots = function (day) {
    if (!this.isAvailableOnDay(day)) {
        return [];
    }

    return this.timeSlots || [];
};

// Pre-save middleware to validate time slots
serviceSchema.pre('save', function (next) {
    if (this.timeSlots && this.timeSlots.length > 0) {
        // Validate time slot format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        for (let slot of this.timeSlots) {
            if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
                return next(new Error('Invalid time format. Use HH:MM format.'));
            }

            if (slot.startTime >= slot.endTime) {
                return next(new Error('Start time must be before end time.'));
            }
        }
    }

    next();
});

// Ensure virtual fields are serialized
serviceSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return ret;
    }
});

module.exports = mongoose.model('Service', serviceSchema); 