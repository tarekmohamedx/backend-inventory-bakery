
const orderService = require("../services/orderOffline.service");
const cartService = require("../services/cart.service");
const httpStatusText = require("../utils/httpStatusText");
const verifyToken  = require("../middlewere/authentication.middlewere");
const { clearCashierCartService } = require("../services/orderOffline.service");
const OrderOffline = require('../models/OrderOffline.model'); 
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const jwt = require("jsonwebtoken");

// ------------------------------
// GET Order by ID
// ------------------------------

module.exports = (() => {
  const router = require("express").Router();

  router.get("/orders", async (req, res) => {
    try {
      const order = await orderService.getallorders();
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/order/:orderId", async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// CREATE Order
// ------------------------------
router.post("/order", async (req, res) => {
  try {
    const { items, totalAmount, Address, paymentMethod, cashier } = req.body;
    // Prepare order data
    const orderData = {
      items,
      totalAmount,
      Address,
      paymentMethod,
      orderStatus: "delivered",
      cashier,
    };

    console.log("orderdata: ", orderData);
    const newOrder = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------------------
// CLEAR CASHIER CART
// ------------------------------
router.post("/cashier/clear-cart",verifyToken ,async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access Denied. No valid token provided." });
    }
    const token = authHeader.split(" ")[1];
    const userId = req.user.userId;
    console.log("User ID from token:", userId);
    const result = await clearCashierCartService(userId, token);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error clearing cart from database and token:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// router.patch("/order/changestatus/:id", async (req, res) => {
//   const { id } = req.params;
//   const { orderStatus } = req.body;
//   try {
//     const orderr = await Order.findByIdAndUpdate(id, { orderStatus: orderStatus }, { new: true });
//     if (!orderr) return res.status(404).send('Order not found');
//     res.send(orderr);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

router.patch('/orders/:orderId/cancel', async (req, res) => {
  try {
    const order = await OrderOffline.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Check if the order is within the 24-hour cancellation window.
    const timeDiff = Date.now() - new Date(order.createdAt).getTime();
    if (timeDiff > ONE_DAY_MS) {
      return res.status(400).json({ error: 'Cancellation window expired. Orders cannot be canceled after 24 hours.' });
    }

    // Update order status to "canceled" and update the updatedAt field.
    order.orderStatus = 'canceled';
    order.updatedAt = Date.now();
    await order.save();

    return res.json({ message: 'Order canceled successfully.', order });
  } catch (error) {
    console.error('Error canceling order:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

router.patch('/orders/:orderId/update', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        error: 'Invalid items format. "items" must be an array.'
      });
    }

    const order = await OrderOffline.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Overwrite items, recalculate totalAmount
    order.items = items;
    order.totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    order.updatedAt = Date.now();
    await order.save();

    // **Populate** the product references after saving
    await order.populate('items.productId');

    return res.json({
      message: 'Order updated successfully.',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
});


router.delete('/orders/:orderId', async (req, res) => {
  try {
    const order = await OrderOffline.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    await OrderOffline.findByIdAndDelete(req.params.orderId);

    return res.json({ message: 'Order removed successfully.' });
  } catch (error) {
    console.error('Error removing order:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
});





return router;
})();


