const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please provide appointment date']
    },
    startTime: {
        type: String,
        required: [true, 'Please provide start time']
    },
    endTime: {
        type: String,
        required: [true, 'Please provide end time']
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online', 'other'],
        default: 'cash'
    },
    paymentDetails: {
        transactionId: String,
        paymentDate: Date,
        refundAmount: Number,
        refundDate: Date
    },
    services: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        addOns: [{
            name: String,
            price: Number,
            quantity: Number
        }]
    }],
    customerNotes: {
        type: String,
        maxlength: [500, 'Customer notes cannot be more than 500 characters']
    },
    salonNotes: {
        type: String,
        maxlength: [500, 'Salon notes cannot be more than 500 characters']
    },
    cancellationReason: {
        type: String,
        maxlength: [200, 'Cancellation reason cannot be more than 200 characters']
    },
    cancellationDate: Date,
    cancelledBy: {
        type: String,
        enum: ['customer', 'salon', 'system'],
        default: 'customer'
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderDate: Date,
    checkInTime: Date,
    checkOutTime: Date,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: [1000, 'Review cannot be more than 1000 characters']
    },
    reviewDate: Date,
    isRescheduled: {
        type: Boolean,
        default: false
    },
    originalBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    rescheduledTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    specialRequests: [{
        type: String,
        maxlength: [200, 'Special request cannot be more than 200 characters']
    }],
    allergies: [{
        type: String,
        maxlength: [100, 'Allergy cannot be more than 100 characters']
    }],
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ customer: 1 });
bookingSchema.index({ salon: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ appointmentDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ 'appointmentDate': 1, 'startTime': 1 });
bookingSchema.index({ salon: 1, appointmentDate: 1, status: 1 });

// Virtual for appointment date and time
bookingSchema.virtual('appointmentDateTime').get(function () {
    const date = new Date(this.appointmentDate);
    const [hours, minutes] = this.startTime.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
});

// Virtual for end date and time
bookingSchema.virtual('endDateTime').get(function () {
    const date = new Date(this.appointmentDate);
    const [hours, minutes] = this.endTime.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
});

// Virtual for formatted appointment time
bookingSchema.virtual('formattedAppointmentTime').get(function () {
    const date = new Date(this.appointmentDate);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return `${date.toLocaleDateString('en-US', options)} at ${this.startTime}`;
});

// Virtual for time until appointment
bookingSchema.virtual('timeUntilAppointment').get(function () {
    const now = new Date();
    const appointmentTime = this.appointmentDateTime;
    const diffTime = appointmentTime - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffTime < 0) {
        return 'Past';
    } else if (diffDays > 1) {
        return `${diffDays} days`;
    } else if (diffHours > 1) {
        return `${diffHours} hours`;
    } else {
        return 'Less than 1 hour';
    }
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function () {
    const now = new Date();
    const appointmentTime = this.appointmentDateTime;
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    return this.status === 'pending' ||
        this.status === 'confirmed' &&
        hoursUntilAppointment > 24; // 24 hours notice
};

// Method to check if booking can be rescheduled
bookingSchema.methods.canBeRescheduled = function () {
    const now = new Date();
    const appointmentTime = this.appointmentDateTime;
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    return this.status === 'pending' ||
        this.status === 'confirmed' &&
        hoursUntilAppointment > 2; // 2 hours notice
};

// Method to calculate total amount including add-ons
bookingSchema.methods.calculateTotal = function () {
    let total = 0;

    for (let service of this.services) {
        total += service.price * service.quantity;

        for (let addOn of service.addOns) {
            total += addOn.price * addOn.quantity;
        }
    }

    return total;
};

// Pre-save middleware to validate appointment time
bookingSchema.pre('save', function (next) {
    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(this.startTime) || !timeRegex.test(this.endTime)) {
        return next(new Error('Invalid time format. Use HH:MM format.'));
    }

    if (this.startTime >= this.endTime) {
        return next(new Error('Start time must be before end time.'));
    }

    // Validate appointment date is not in the past
    const appointmentDate = new Date(this.appointmentDate);
    const now = new Date();

    if (appointmentDate < now.setHours(0, 0, 0, 0)) {
        return next(new Error('Appointment date cannot be in the past.'));
    }

    next();
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return ret;
    }
});

module.exports = mongoose.model('Booking', bookingSchema); 