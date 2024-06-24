// const mongoose = require("mongoose")

// const userSchema = new mongoose.Schema({
//     googleId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     displayName: String,
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     photo: String
// })
// module.exports = mongoose.model('User',userSchema)

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allow this field to be optional
    },
    displayName: String,
    photo: String,
    createdAt : {
        type : Date,
        default : Date.now
    }
})
module.exports = mongoose.model('User', userSchema)