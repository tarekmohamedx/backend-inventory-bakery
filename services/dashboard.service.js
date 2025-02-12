const Order = require('../models/orders.model')

module.exports.pendingOrders = async()=>{
    return await Order.find({orderStatus:'pending'})
}

module.exports.totalMoney = async()=>{
    return await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);
}