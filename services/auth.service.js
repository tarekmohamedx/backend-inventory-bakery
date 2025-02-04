const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwttoken.maneger");
const { createUser, authenticateUser } = require("../services/user2.service");
const UserService = require("../services/user2.service");
const {APP_CONFIG} = require("../config/db");
const jwt = require("jsonwebtoken");
// Register user [after register will return a token]
const registerUser = async (userbody) => {
  try {
    // Call createUser to handle user creation and retrieve the claim
    //const claims = await createUser(userbody);
    const claims = await UserService.createUser(userbody);

    // error here [firstname & lastname == undefine]
    // after user create user this method will return a claim to this user to use signtoken to give this token to this user

    // Generate a JWT token using the returned claim
    const token = signToken({ claims });

    // Return the token
    return { token };
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw new Error("Failed to register user");
  }
};

// Login user
const loginUser = async ({ email, password }) => {
  try {
    const user = await authenticateUser(email, password);

    const claim = {
      userid: user._id,
      // username: `${user.firstName} ${user.lastName}`, // Combine first and last names
      // firstName: user.firstname,
      // lastName: user.lastname,
      email: user.email,
      
    };

    const token = signToken({ claim });

    return { token };
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw new Error("Failed to login user");
  }
};

// this will take a token and decode it 
//   const decode =  async ({token}) =>{
// try {
//   const sk = APP_CONFIG.mongosec;
//   // const decoded =  jwt.decode(token); // Decodes the token without verifying it
//   const decode = await jwt.verify(sk,token);  
//   return decode; // This will contain the claims like userId
// } catch (err) {
//   console.error("Error decoding token:", err);
//   return null;
// }
//   };

module.exports = {
  registerUser,
  loginUser,
  // decode
};
