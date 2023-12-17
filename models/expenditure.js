const mongoose = require('mongoose');


const expenditureSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
        required: true,
    }
})


module.exports = mongoose.model('Expenditure', expenditureSchema);