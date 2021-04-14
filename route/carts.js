const express = require('express');
const { getCarts, getCart, createCart, updateCart, deleteCart } = require('../controllers/carts');

const Cart = require('../models/Cart');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedRequests');
const { protect, authorize } = require('../middlewares/auth');


router.use(protect);
router.use(authorize('admin', 'user'));


router.route('/')
    .get(advancedResults(Cart), getCarts)
    .post(createCart);

router.route('/:id')
    .get(getCart)
    .put(updateCart)
    .delete(deleteCart);

module.exports = router;