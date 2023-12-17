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
        type: monoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
        required: true,
    }
})


module.exports = monoose.model('Expenditure', expenditureSchema);