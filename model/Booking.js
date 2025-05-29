const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { // referencing user by ObjectId
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    carName: {
        type: String,
        required: true,
    },
    carType: {
        type: String,
        required: true,
    },
    pickupAddress: {
        type: String,
        required: true,
    },
    dropoffAddress: {
        type: String,
        required: true,
    },
    // Renamed and restructured for GeoJSON Point
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type
            required: true
        },
        coordinates: { // [longitude, latitude]
            type: [Number],
            required: true
        }
    },
    // Renamed and restructured for GeoJSON Point
    dropoffLocation: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type
            required: true
        },
        coordinates: { // [longitude, latitude]
            type: [Number],
            required: true
        }
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    dropoffDate: {
        type: Date,
        required: true,
    },
    totalDates: {
        type: Number,
        required: true,
    },
    totalFare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
}, { timestamps: true });

// Add geospatial indexes for efficient location-based queries
bookingSchema.index({ pickupLocation: '2dsphere' });
bookingSchema.index({ dropoffLocation: '2dsphere' });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = Booking;
