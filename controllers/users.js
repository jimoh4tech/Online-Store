const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');



// @desc    Get all users
// @route   GET api/v1/users
// @access  Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


// @desc    Get single
// @route   GET api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse(`User not found with the id ${req.params.id}`,404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Create user
// @route   POST api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});


// @desc    Update user
// @route   PUT api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: user });
});



// @desc    Delete user
// @route   DELETE api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);


    //Make sure the user exist
    if (!user) {
        return next(new ErrorResponse(`User not found with the id of ${req.params.id}`, 404));
    }

    // Make sure user is admin
    if (req.user.role != 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this product`, 401));
    }

    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success: true,
        data: {}
    });
});
