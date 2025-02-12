const order = require("../models/orders.model");

const orderRepository = {
  createorder: async (orderData) => {
    const Order = await order.create(orderData);
    return Order;
  },

  // return all orders to admin 

  getallorder: async() => {
const orders = await order.find();
return orders;
  },
getorderbyid:async(orderid) => {
  const o = await order.findOne({_id:orderid});
  return o;
},

  // need to return orders related this user
  // already i have a userid from claims from token
  // to display it in user profile
  findorderbuuserid: async (userid) => {
    return await order.find({ customerId: userid });
  },
};

module.exports = orderRepository;
