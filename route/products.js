const express = require('express');

const { getProducts, getProduct, productPhotoUpload, createProduct,
    updateProduct, deleteProduct } = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router();

const advancedResults = require('../middlewares/advancedRequests');
const { protect, authorize } = require('../middlewares/auth');

router.route('/:id/photo').put(protect, authorize('admin'), productPhotoUpload);

router
    .route('/')
    .get(advancedResults(Product, 'courses'), getProducts);

router.route('/:id')
    .post(protect, authorize('admin'), createProduct)
    .get(getProduct)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);


module.exports = router;