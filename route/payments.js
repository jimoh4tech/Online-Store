const express = require('express');
const { getPayments, getPayment, createPayment, updatePayment, deletePayment } = require('../controllers/payments');

const Payment = require('../models/Payment');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedRequests');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
    .post(createPayment);

router.use(protect);
router.use(authorize('admin'));


router.route('/')
    .get(advancedResults(Payment), getPayments)

router.route('/:id')
    .get(getPayment)
    .put(updatePayment)
    .delete(deletePayment);

module.exports = router;