const { Error } = require("mongoose");
const orderRepository = require("../repos/order.repo");
const UserRepository = require("../repos/order.repo");

const orderservice = {
  createorder: async (orderData) => {
    try {
      // create object to pass it to repo
            const namePattern = /^[a-zA-Z\s'-]{2,50}$/;
            if (!namePattern.test(orderData.firstname)) {
              throw new Error(
                "Invalid first name. It should contain only letters and be at least 2 characters long."
              );
            }
            if (!namePattern.test(orderData.lastname)) {
              throw new Error(
                "Invalid last name. It should contain only letters and be at least 2 characters long."
              );
            }

            // Validation for promoCode (must be a valid number)
            const promoCodePattern = /^[0-9]{8,10}$/; // Adjust length if necessary
            if (
              orderData.promoCode &&
              !promoCodePattern.test(orderData.promoCode)
            ) {
              throw new Error(
                "Invalid promo code. It should be a number between 8 to 10 digits."
              );
            }
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

  getallorders: async() =>{
try{
return await orderRepository.getallorder();
}catch(error){
throw new Error(error.message);
}
  },

  getorderbyid:async(orderid) =>{
return await orderRepository.getorderbyid(orderid);
  }
};

module.exports = orderservice;
