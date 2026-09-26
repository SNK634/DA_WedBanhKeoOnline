const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    customerInfo: {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        ward: { type: String, required: true, trim: true },
        note: { type: String, trim: true, default: '' }
    },
    items: [{
        _id: false,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, default: '🎃' },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true, min: 0 }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
        type: String,
        enum: ['cod', 'momo', 'bank'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {
    collection: 'orders',
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Order', orderSchema);
