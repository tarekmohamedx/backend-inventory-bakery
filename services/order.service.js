const orderRepository = require("../repos/order.repo");
const UserRepository = require("../repos/order.repo");

const orderservice = {
  createorder: async (orderData) => {
    try {
      // create object to pass it to repo
      const orderpayload = {
        items: orderData.items,
        customerId: orderData.customerId,
        totalAmount: orderData.totalAmount,
        shippingAddress: {
          governorate: orderData.shippingAddress.governorate,
          city: orderData.shippingAddress.city,
        },
        customername:{
            firstname:orderData.firstname,
            lastname:orderData.lastname,
        },
        paymentMethod: orderData.paymentMethod,
        addressdetails: orderData.addressdetails,
        paymentCode: orderData.paymentCode,
        orderStatus: "pending",
      };
      const createorder = await orderRepository.createorder(orderpayload);
      return createorder; // will return order after save it success
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  },
};

module.exports = orderservice;
