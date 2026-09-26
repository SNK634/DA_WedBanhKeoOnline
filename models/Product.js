const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 160
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    shortDescription: {
        type: String,
        required: true,
        trim: true
    },
    origin: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    ingredients: { type: String, required: true, trim: true },
    weight: { type: String, required: true, trim: true },
    expiry: { type: String, required: true, trim: true },
    storage: { type: String, required: true, trim: true },
    usage: { type: String, required: true, trim: true },
    allergen: { type: String, required: true, trim: true },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isHot: {
        type: Boolean,
        default: false,
        index: true
    },
    isBestSeller: {
        type: Boolean,
        default: false,
        index: true
    },
    soldCount: {
        type: Number,
        default: 0,
        min: 0,
        index: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    reviews: [{
        _id: false,
        userName: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'products',
    versionKey: false
});

module.exports = mongoose.model('Product', productSchema);
