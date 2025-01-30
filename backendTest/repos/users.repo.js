const User = require('../models/users.model');

// get all users
module.exports.getUsers = async() => {
    try{
        const users = await User.find({});
        return users;
    }catch (error) {
        console.error("get All users error: ", error);
        throw error;
    }
} 

// get user detail
module.exports.getUserById = async (userId) => {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
};
  
  // create user
module.exports.createUser = async (userData) => {
    try {
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
  
  // update user
module.exports.updateUser = async (userId, updatedData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
        });
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

  // Soft remove account ( delete user account )
module.exports.softDelete = async (userId, updatedData) => {
    try {
        return await User.findByIdAndUpdate(userId, updatedData,{ new: true, runValidators: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
  
  // delete a user
module.exports.deleteUser = async (userId) => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
  