const User = require('../models/users.model');
class UserProfileRepository {
    // Fetch user profile by ID
    async findUserById(userId) {
      return await User.findById(userId);
    }
  
    // Update user profile by ID
    async updateUserProfile(userId, updateData) {
      return await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
    }
  }
  module.exports = new UserProfileRepository();
