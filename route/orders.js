const express = require('express');
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orders');

const Order = require('../models/Order');



const advancedResults = require('../middlewares/advancedRequests');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });




router.route('/')
    .get(advancedResults(Order, {
        path: 'user',
        select: 'name email',
        path: 'payment',
        select: 'amount status'
    }), getOrders);

router.route('/:id')
    .post(createOrder)
    .get(getOrder)
    .put(protect, authorize('admin'), updateOrder)
    .delete(protect, authorize('admin'), deleteOrder);

module.exports = router;