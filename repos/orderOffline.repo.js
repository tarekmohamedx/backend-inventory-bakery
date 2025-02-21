const OrderOffline = require('../models/OrderOffline.model'); 
const productService = require("../services/product.service");

module.exports = {
  getOrderById: async (orderId) => {
    try {
      const order = await OrderOffline.findById(orderId)
        .populate('items.productId', 'name price sellerId')
        .exec();

      return order;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
    }
  },
  createOrder: async (orderData) => {
    try {
      const newOrder = new OrderOffline(orderData);
      return await newOrder.save();
    } catch (error) {
      throw new Error('Error creating order: ' + error.message);
    }
  },

    getOrderBySeller:async(sellerId) =>{
        try{
        const products = await productService.getProductsBySeller(sellerId);
        const orders = await OrderOffline.find({
            "items.productId": { $in: products.map(product => product._id) },
        }).populate("items.productId", "name price sellerId");
        return orders;
        }catch{
        console.error("Error fetching orders for seller:", error.message);
        throw new Error('Error fetching orders');
        }
    }

};
