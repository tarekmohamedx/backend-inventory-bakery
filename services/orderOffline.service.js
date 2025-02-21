const orderRepo = require('../repos/orderOffline.repo');
const cartService = require("../services/cart.service");
const {signToken} = require('../utils/jwttoken.maneger');
const jwt = require("jsonwebtoken");

module.exports = {
  async getOrderById(orderId) {
    try {
      const order = await orderRepo.getOrderById(orderId);
      return order;
    } catch (error) {
      throw new Error('Service error: ' + error.message);
    }
  },

  async createOrder(orderData) {
    try {
      const createdOrder = await orderRepo.createOrder(orderData);
      return createdOrder;
    } catch (error) {
      throw new Error('Service error: ' + error.message);
    }
  },

  getOrdersBySeller : async (sellerId) => {
    try {
      const orders = await orderRepo.getOrderBySeller(sellerId);
      return orders;
    } catch (error) {
      console.error('Error in order service:', error.message);
      throw new Error('Error fetching orders from service');
    }
  },  

};


module.exports.clearCashierCartService = async (userId, token) => {
  await cartService.clearCart(userId);
  const decodedToken = jwt.decode(token);
  if (!decodedToken) {
    throw new Error("Invalid or expired token.");
  }
  const { exp, ...updatedClaims } = decodedToken;
  updatedClaims.cartItems = [];
  const newToken = signToken({ claims: updatedClaims });
  return {
    message: "Cart cleared successfully from both database and token.",
    token: newToken,
  };
}

