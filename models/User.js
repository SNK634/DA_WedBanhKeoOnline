const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 160
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users',
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);
