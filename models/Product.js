const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['shirt', 'trouser', 'shoe']
    },
    price: {
        type: Number,
        required: [true, 'Please add amount']
    },
    status: {
        type: Boolean,
        default: true
    },
    photoUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'Please add product name']
    }
});

module.exports = mongoose.model('Product', ProductSchema);