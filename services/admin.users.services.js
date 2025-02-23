const userService = require('./users.service');
const User = require('../models/users.model')
const adminUserRepo = require('../repos/admin.user.repo');

const getUserByRole = async (role)=>{
    try{
        const usersRoles = await User.find({role})
        return usersRoles;
    }catch(err){
        throw new Error("Error fetching users by role: " + error.message);
    }
}

const removeCustomer = async(userId)=>{
    const orders = await adminUserRepo.fetchOrderStatusByUser(userId);
    if (orders.length !== 0) {
        throw new Error("User has Pending orders and cannot be deleted.");
    }else{
        return await adminUserRepo.deleteUser(userId);
    }
}

const removeSeller = async(userId)=>{

}
const removeUser = async (userId)=>{
    try{
        const userRole = await adminUserRepo.getUserRole(userId);
        if(userRole == 'Customer')
           return await removeCustomer(userId);
        else if(userRole == 'Admin'){
            throw new Error("You cannot remove your own role");
        }
        else 
            return await adminUserRepo.deleteUser(userId);

        
       
        
    }catch(err){
        throw new Error(err.message);
    }
}

module.exports = {
    getUserByRole,
    removeUser
}

