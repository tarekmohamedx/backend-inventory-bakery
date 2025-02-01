const order = require("../models/orders.model");

const orderRepository = {
  createorder: async (orderData) => {
    const o = await order.create(orderData);
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
