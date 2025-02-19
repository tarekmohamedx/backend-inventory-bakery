const bcrypt = require('bcrypt');
const userProfileRepo  = require('../repos/UserProfile1.repo.js');
class UserProfileService {
    // Fetch user profile by ID
    async getUserProfile(userId) {
      const user = await userProfileRepo.findUserById(userId);
      if (!user) throw new Error('User not found');
      return user;
    }
  
    // Update user profile by ID
    async updateUserProfile(userId, updateData) {
      // Handle password update
      if (updateData.currentPassword && updateData.newPassword) {
        const user = await userProfileRepository.findUserById(userId);
        if (!user) throw new Error('User not found');
  
        // Validate current password
        const isMatch = await bcrypt.compare(updateData.currentPassword, user.password);
        if (!isMatch) throw new Error('Current password is incorrect');
  
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.newPassword, salt);
  
        // Remove temp fields
        delete updateData.currentPassword;
        delete updateData.newPassword;
      }
  
      return await userProfileRepo.updateUserProfile(userId, updateData);
    }
  }
  
  module.exports = new UserProfileService();