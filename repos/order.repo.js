const order = require("../models/orders.model");

const orderRepository = {
  createorder: async (orderData) => {
    const o = await order.create(orderData);
    return o;
  },
  findorderbuuserid: async (userid) => {
    return await order.find({ customerId: userid });
  },
};

module.exports = orderRepository;
