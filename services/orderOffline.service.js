const orderRepo = require('../repos/orderOffline.repo');

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
  }

};
