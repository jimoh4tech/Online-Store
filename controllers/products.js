const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Product = require('../models/Product');
const User = require('../models/User');

// @Desc    Get all products
// @route   GET api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @Desc    Get single product
// @route   GET api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});


// @desc    Create new product
// @route   POST api/v1/products/:id
// @access  Admin
exports.createProduct = asyncHandler(async (req, res, next) => {

    if(!req.params.id){
        return next(new ErrorResponse(`Only admin is authorized to add products`, 401));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`No user found with the id of ${req.user.id}`, 404));
    }

    // Make sure user is admin
    if (user.role != 'admin') {
        return next(new ErrorResponse(`Only admin is authorized to add products`, 401));
    }
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});



// @desc    Update product
// @route   PUT api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is admin
    if (req.user.role != 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this product`, 401));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: product });
});


// @desc    Delete product
// @route   DELETE api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is admin
    if (req.user.role != 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this product`, 401));
    }

    product.remove();
    res.status(200).json({ succes: true, data: {} });
});



// @desc    Upload photo for product
// @route   PUT api/v1/products/:id/photo
// @access  Admin
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is admin
    if (req.user.role != 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this product`, 401));
    }


    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404));
    }

    //Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 404));
    }

    // Create custom filename
    file.name = `photo_${product._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Product.findByIdAndUpdate(req.params.id, { photoUrl: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});

