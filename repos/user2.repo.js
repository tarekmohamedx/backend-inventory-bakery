const User = require("../models/users.model");

const UserRepository = {
  // create a new user will use it in register
  createUser: async (userData) => {
    const s = await User.create(userData);
    return s;
  },

  // find user by id will use it in profile [must]
  findUserById: async (userId) => {
    return await User.findOne({ user_id: userId });
  },
  // return all users will use it in admin panel
  findallusers: async () => {
    return await User.find({});
  },
  // find user by email will use it in login [must]
  findUserByEmail: async (email) => {
    return await User.findOne({ email });
  },
  // update user will use it in update profile
  updateUser: async (userId, updateData) => {
    return await User.findOneAndUpdate({ user_id: userId }, updateData, {
      new: true,
    });
  },
  // delete user will use it in delete user
  deleteUser: async (userId) => {
    return await User.findOneAndDelete({ user_id: userId });
  },
};

module.exports = UserRepository;
