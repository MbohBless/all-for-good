const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    totalSavings: {
        type: Number,
        default: 0,
    },
    totalWithdrawals: {
        type: Number,
        default: 0,
    }

})


// const vme
module.exports = mongoose.model('User', userSchema);
