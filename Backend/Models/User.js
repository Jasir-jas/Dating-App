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
    },
    photo: String,
    token: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Method to generate authentication token
// userSchema.methods.generateAuthToken = async function () {
//     const user = this;
//     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);
//     user.tokens = user.tokens.concat({ token });
//     await user.save();
//     return token;
// };
module.exports = mongoose.model('User', userSchema)