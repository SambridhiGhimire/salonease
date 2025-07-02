const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    openTime: {
        type: String,
        required: function () { return this.isOpen; }
    },
    closeTime: {
        type: String,
        required: function () { return this.isOpen; }
    },
    breakStart: String,
    breakEnd: String
});

const salonSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a salon name'],
        trim: true,
        maxlength: [100, 'Salon name cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    logo: {
        type: String,
        default: null
    },
    images: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['hair', 'nail', 'spa', 'massage', 'beauty', 'barber', 'wellness', 'other'],
        required: true
    },
    specialties: [{
        type: String,
        enum: ['haircut', 'coloring', 'styling', 'manicure', 'pedicure', 'facial', 'massage', 'waxing', 'makeup', 'eyebrows', 'lashes', 'other']
    }],
    address: {
        street: {
            type: String,
            required: [true, 'Please provide street address']
        },
        city: {
            type: String,
            required: [true, 'Please provide city']
        },
        state: {
            type: String,
            required: [true, 'Please provide state']
        },
        zipCode: {
            type: String,
            required: [true, 'Please provide zip code']
        },
        country: {
            type: String,
            default: 'United States'
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Please provide phone number']
        },
        email: {
            type: String,
            required: [true, 'Please provide email']
        },
        website: String,
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String
        }
    },
    workingHours: [workingHoursSchema],
    isOpen: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    rating: {
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
    },
    pricing: {
        minPrice: {
            type: Number,
            default: 0
        },
        maxPrice: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    amenities: [{
        type: String,
        enum: ['wifi', 'parking', 'wheelchair_accessible', 'credit_cards', 'appointments', 'walk_ins', 'private_rooms', 'music', 'tv', 'refreshments', 'other']
    }],
    languages: [{
        type: String,
        default: ['English']
    }],
    policies: {
        cancellationPolicy: {
            type: String,
            enum: ['flexible', 'moderate', 'strict'],
            default: 'moderate'
        },
        cancellationHours: {
            type: Number,
            default: 24
        },
        depositRequired: {
            type: Boolean,
            default: false
        },
        depositAmount: {
            type: Number,
            default: 0
        }
    },
    businessInfo: {
        establishedYear: Number,
        licenseNumber: String,
        insuranceInfo: String,
        certifications: [String]
    },
    settings: {
        autoConfirmBookings: {
            type: Boolean,
            default: false
        },
        requireDeposit: {
            type: Boolean,
            default: false
        },
        maxAdvanceBookingDays: {
            type: Number,
            default: 30
        },
        minAdvanceBookingHours: {
            type: Number,
            default: 2
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
salonSchema.index({ location: '2dsphere' });
salonSchema.index({ owner: 1 });
salonSchema.index({ category: 1 });
salonSchema.index({ 'address.city': 1, 'address.state': 1 });
salonSchema.index({ isVerified: 1, isActive: 1 });
salonSchema.index({ rating: -1 });
salonSchema.index({ isFeatured: 1 });

// Virtual for full address
salonSchema.virtual('fullAddress').get(function () {
    const parts = [
        this.address.street,
        this.address.city,
        this.address.state,
        this.address.zipCode,
        this.address.country
    ].filter(Boolean);

    return parts.join(', ');
});

// Virtual for distance calculation (to be used with geospatial queries)
salonSchema.virtual('distance').get(function () {
    return this._distance;
});

// Method to update rating
salonSchema.methods.updateRating = function (newRating) {
    const totalRating = this.rating.average * this.rating.count + newRating;
    this.rating.count += 1;
    this.rating.average = totalRating / this.rating.count;
    return this.save();
};

// Method to check if salon is currently open
salonSchema.methods.isCurrentlyOpen = function () {
    if (!this.isOpen) return false;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

    const todayHours = this.workingHours.find(hours => hours.day === currentDay);

    if (!todayHours || !todayHours.isOpen) return false;

    return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
};

// Pre-save middleware to update pricing range
salonSchema.pre('save', function (next) {
    // This will be updated when services are added/modified
    next();
});

// Ensure virtual fields are serialized
salonSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.isCurrentlyOpen = doc.isCurrentlyOpen();
        return ret;
    }
});

module.exports = mongoose.model('Salon', salonSchema); 