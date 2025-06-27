const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');
const authenticate=require("../middleware/authenticate.js");

router.post('/create-payment-intent', authenticate, paymentController.createPaymentIntent);

module.exports = router; 