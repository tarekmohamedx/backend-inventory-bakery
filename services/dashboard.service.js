const Order = require('../models/orders.model')
const User = require('../models/users.model')
const Product = require('../models/Product.model')

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

module.exports.lastestOrders = async()=>{
    return await Order.find({ orderStatus: 'pending' })
    .sort({createdAt:-1})
    .limit(5).exec();
}

module.exports.customersCount = async()=>{
    return await User.countDocuments({role:'Customer'}); 
}

module.exports.mostSellingProducts = async()=>{
    return await Product.find().sort({sales:-1}).limit(5);
}