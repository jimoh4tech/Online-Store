const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    address: {
        type: String,
        required: [true, 'Please add address']
    },
    product: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Product',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        required: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please add user details']
    },
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment',
        required: [true, 'Please add payment details']
    },
    status: {
        type: String,
        enum: ['delivered', 'failed', 'awaiting']
    }

});

module.exports = mongoose.model('Order', OrderSchema);