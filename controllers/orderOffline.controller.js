
const orderService = require("../services/orderOffline.service");
const cartService = require("../services/cart.service");
const httpStatusText = require("../utils/httpStatusText");
const verifyToken  = require("../middlewere/authentication.middlewere");
const { clearCashierCartService } = require("../services/orderOffline.service");
const jwt = require("jsonwebtoken");

// ------------------------------
// GET Order by ID
// ------------------------------

module.exports = (() => {
  const router = require("express").Router();

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
    const { items, totalAmount, Address, paymentMethod } = req.body;

    // Prepare order data
    const orderData = {
      items,
      totalAmount,
      Address,
      paymentMethod,
      orderStatus: "delivered",
    };

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


return router;
})();


