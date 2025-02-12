const User = require('../models/users.model');
const Order = require('../models/orders.model');

const getUserRole = async (userId) => {
    try {
        const user = await User.findById(userId, { role: 1, _id: 0 });
        return user?.role || null;
    } catch (error) {
        throw new Error("Error fetching user role: " + error.message);
    }
};


const fetchOrderStatusByUser = async (userId) => {
        const orders = await Order.find({customerId: userId}, {orderStatus:1, _id:0});
        return orders        
}

const deleteUser = async (userId) => {
    return await User.findOneAndDelete({ _id: userId });
  }


module.exports = {
    fetchOrderStatusByUser,
    getUserRole,
    deleteUser
}