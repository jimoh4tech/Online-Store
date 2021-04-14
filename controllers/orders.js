const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');


// @desc    Get orders
// @route   GET api/v1/orders
// @route   GET api/v1/users/:userId/orders
// @access  Public/Private
exports.getOrders = asyncHandler(async (req, res, next) => {

    if (req.params.userId) {
        const orders = await Order.find({ user: req.params.userId });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } else {
        res.status(200).json(res.advancedResults);
    }



});



// @desc    Get single order
// @route   GET api/v1/orders/:id
// @access  Private/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate({
        path: 'user',
        select: 'name email',
        path: 'payment',
        select: 'amount status'
    });

    if (!order) {
        return next(new ErrorResponse(`No order with the id of ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        data: order
    });
});


// @desc    Create order
// @route   POST api/v1/orders/:userId
// @access  Public
exports.createOrder = asyncHandler(async (req, res, next) => {

    if(!req.params.id){
        return next(new ErrorResponse(`Only users are authorized to initiate orders`, 401));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`No user found with the id of ${req.user.id}`, 404));
    }

    req.body.user = req.params.id;

    const {product, payment} = req.body;

    const curProduct = await Product.findById(product);

    if (!curProduct) {
        return next(new ErrorResponse(`Product not found with the id of ${curProduct.id}`));
    }

    
    const curPayment = await Payment.findById(payment);

    
    if (!curPayment) {
        return next(new ErrorResponse(`Payment not found with the id of ${curPayment.id}`));
    }
    
    const order = await Order.create(req.body);

    res.status(201).json({
        success: true,
        data: order
    });
});


// @desc    Update order
// @route   PUT api/v1/orders/:id
// @access  Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
    let order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`No order with the id of ${req.params.id}`), 404);
    }

    // Make sure user is admin
    if (req.user.role != 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update order ${order._id}`, 401));
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: order
    });
});



// @desc    Delete order
// @route   DELETE api/v1/orders/:id
// @access  Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`No order with the id of ${req.params.id}`), 404);
    }

    // Make sure user is admin
    if (req.user.role != 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete order ${order._id}`, 401));
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});