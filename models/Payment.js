const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add amount']
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'pending'],
        required: [true, 'Please add payment status']
    }

});

module.exports = mongoose.model('Payment', PaymentSchema);