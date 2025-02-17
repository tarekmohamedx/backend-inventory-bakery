const bcrypt = require("bcrypt");

const {signToken} = require('../utils/jwttoken.maneger');

const { createUser, authenticateUser } = require("../services/user2.service");
const UserService = require("../services/user2.service");
const {APP_CONFIG} = require("../config/db");
const jwt = require("jsonwebtoken");
const registerUser = async (userbody) => {
  try {
    const claims = await UserService.createUser(userbody);

    // Generate a JWT token using the returned claim
    const token = signToken({ claims });

    // Return the token
    return { token };
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw new Error("Failed to register user, Registerd");
  }
};

// Login user
const loginUser = async ({ email, password }) => {
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      throw new Error("User not found or invalid credentials");
    }

    const claims = {
      userId: user._id,
      email: user.email,
      user_type: user.user_type,
      role: user.role
    };


    const token = signToken({ claims });

    return { token , user };
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw new Error("Failed to login user");
  }
};

module.exports = {
  registerUser,
  loginUser,
  // decode
};
