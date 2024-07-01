const mongoose = require("mongoose")
const User = require("./User")

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    hobbies: {
        type: [String],
        required: true,
    },
    interest: {
        type: [String],
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    smokingHabits: {
        type: String,
        required: true,
    },
    drinkingHabits: {
        type: String,
        required: true,
    },
    profile_image_url: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})
module.exports = mongoose.model('Profile', profileSchema)