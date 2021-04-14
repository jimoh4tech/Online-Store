const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    product: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Product',
        required: [true, 'Please add a product']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Cart', CartSchema);