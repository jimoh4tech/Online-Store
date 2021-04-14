const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Cart = require('../models/Cart');


// @desc    Get all carts
// @route   GET api/v1/carts
// @access  Public
exports.getCarts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);

});



// @desc    Get single
// @route   GET api/v1/carts/:id
// @access  Public
exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        return next(new ErrorResponse(`Cart not found with the id of ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        data: cart
    });
});


// @desc    Create cart
// @route   POST api/v1/carts
// @access  Public
exports.createCart = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check for available carts
    const publishedCart = await Cart.findOne({ user: req.user.id });

    // If user is not admin, they can only add one cart
    if (publishedCart&& req.user.role !== 'admin') {
        return next(new ErrorResponse(`This user with ID ${req.user.id} already has a cart`, 400));
    }
    const cart = await Cart.create(req.body);

    res.status(201).json({
        success: true,
        data: cart
    });
});


// @desc    Update cart
// @route   PUT api/v1/carts/:id
// @access  Publlic
exports.updateCart = asyncHandler(async (req, res, next) => {

    const cart = await Cart.findById(req.params.id)

    if (!cart) {
        return next(new ErrorResponse(`Cart not found with the id of ${req.params.id}`));
    }
    await Cart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: cart
    });
});



// @desc    Delete cart
// @route   DELETE api/v1/carts/:id
// @access  Public
exports.deleteCart = asyncHandler(async (req, res, next) => {

    const cart = await Cart.findById(req.params.id)

    if (!cart) {
        return next(new ErrorResponse(`Cart not found with the id of ${req.params.id}`));
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});