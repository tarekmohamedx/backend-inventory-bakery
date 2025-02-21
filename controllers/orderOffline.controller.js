const orderService = require('../services/orderOffline.service');
const router = require("express").Router();

const routes = {

  getOrderOffline: async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  createOrderOffline: async (req, res) => {
    try {
      const { items, totalAmount, Address, paymentMethod } = req.body;

      // Prepare order data
      const orderData = {
        items,
        totalAmount,
        Address,
        paymentMethod,
        orderStatus: 'delivered',
      };

      const newOrder = await orderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: newOrder,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

};

router.get("/order/:orderId", routes.getOrderOffline);
router.post("/order", routes.createOrderOffline);

module.exports = router;