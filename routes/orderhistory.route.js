const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


router.get('/history/:customerId', orderController.getOrderHistory);

module.exports = router;
