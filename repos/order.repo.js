const order = require("../models/orders.model");
const productService = require("../services/product.service");
const mongoose = require("mongoose");




const orderRepository = {
  createorder: async (orderData) => {
    const Order = await order.create(orderData);
    return Order;
  },


  // return all orders to admin 

//   getallorder: async() => {
// const orders = await order.find();
// return orders;
//   },
// getorderbyid:async(orderid) => {
//   const o = await order.findOne({_id:orderid});
//   return o;
// },

getallorder: async () => {
  const orders = await order.find().populate("items.productId", "name price");
  return orders;
},

getorderbyid: async (orderid) => {
  const o = await order.findOne({ _id: orderid }).populate("items.productId", "name price");
  return o;
},




  // need to return orders related this user
  // already i have a userid from claims from token
  // to display it in user profile
  // *********************************************
         //getOrdersByCustomerId
        //  getOrdersByCustomerId: async (customerId) => {
        //   return await order.find({ customerId }).sort({ createdAt: -1 });
        // },


        //**********getOrdersByCustomerId*************** */
        getOrdersByCustomerId: async (customerId) => {

          if (!mongoose.Types.ObjectId.isValid(customerId)) {
            throw new Error("Invalid customer ID");
          }
          try{
          return await order.find({customerId}).populate("items.productId", "name price").sort({ createdAt: -1 });
        } catch (error) {
          console.error("Error fetching orders by customer ID:", error.message);
          throw new Error("Error fetching orders");
        }
        }
      ,


  findorderbuuserid: async (userid) => {
    return await order.find({ customerId: userid });
  },

  getOrderBySeller:async(sellerId) =>{
    try{
      const products = await productService.getProductsBySeller(sellerId);
      const orders = await order.find({
        "items.productId": { $in: products.map(product => product._id) }, // Filter orders by seller's product IDs
      }).populate("items.productId", "name price sellerId");
      return orders;
    }catch{
      console.error("Error fetching orders for seller:", error.message);
      throw new Error('Error fetching orders');
    }
  }

  
};

module.exports = orderRepository;
