const User = require('../models/users.model');
const Order = require('../models/orders.model');
const comment = require('../models/comment.model')

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

// Fetch all comments 
const fetchAllComments = async () => {
    try {
        return await Comment.find().sort({ createdAt: -1 });  
    } catch (error) {
        throw new Error("Error fetching comments: " + error.message);
    }
};

// Delete a comment 
const deleteComment = async (commentId) => {
    return await Comment.findByIdAndDelete(commentId);
};

module.exports = {
    fetchOrderStatusByUser,
    getUserRole,
    deleteUser,
    fetchAllComments,
    deleteComment
}