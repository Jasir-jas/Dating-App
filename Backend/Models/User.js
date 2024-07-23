const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FriendRequest',
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
    },
    photo: String,
    token: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    shortlist: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'shortlistModel'
    }],
    shortlistModel: {
        type: [String],
        enum: ['Profile', 'Employee'] // Ensure all possible types are listed here
    }
});

module.exports = mongoose.model('User', userSchema);
