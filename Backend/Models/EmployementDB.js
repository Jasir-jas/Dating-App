const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userCurrent: {
        type: String,
        required: true
    },
    companyname: { type: String },
    designation: { type: String },
    location: { type: String },
    title: { type: String },
    expertiselevel: { type: String },
    userRelationStatus: { type: String },
    genderView: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
