const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Order = require('../models/Order');


// @desc    Get all payments
// @route   GET api/v1/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);

});



// @desc    Get single payment
// @route   GET api/v1/payments/:id
// @access  Private/Admin
exports.getPayment = asyncHandler(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        return next(new ErrorResponse(`No payment found with the id of ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        data: payment
    });
});


// @desc    Create payment
// @route   POST api/v1/payments
// @access  Private/Admin
exports.createPayment = asyncHandler(async (req, res, next) => {

    const {user, order} = req.body;

    const curUser = await User.findById(user);

    if (!curUser) {
        return next(new ErrorResponse(`User not found with the id of ${curUser.id}`));
    }

    
    const curOrder = await Order.findById(order);

    
    if (!curOrder) {
        return next(new ErrorResponse(`Order not found with the id of ${curOrder.id}`));
    }

    const payment = await Payment.create(req.body);

    res.status(201).json({
        success: true,
        data: payment
    });
});


// @desc    Update payment
// @route   PUT api/v1/payments/:id
// @access  Private/Admin
exports.updatePayment = asyncHandler(async (req, res, next) => {

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        return next(new ErrorResponse(`No payment found with the id of ${req.params.id}`));
    }
    await Payment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: payment
    });
});



// @desc    Delete payment
// @route   DELETE api/v1/payments/:id
// @access  Private/Admin
exports.deletePayment = asyncHandler(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        return next(new ErrorResponse(`No payment found with the id of ${req.params.id}`));
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    });
});