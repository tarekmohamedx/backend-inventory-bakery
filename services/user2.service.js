const bcrypt = require("bcrypt");
const UserRepository = require("../repos/user2.repo");
const { model, Error } = require("mongoose");

const UserService = {
  createUser: async (userData) => {
    /*
    in register will catch some of attributes 
    first_name, last_name, email, password,

    
    
    
    
    */
    try {
      // Generate salt
      const salt = await bcrypt.genSalt(10);

      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Prepare user data for creation
      const userPayload = {
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        password: hashedPassword,
        salt,
        role: "Customer",
        cartItems: [], // Use cartItems instead of cartitems
        orderIds: [],
        status: "active",
      };

      // after creating return this user
      // will set in in db
      const createdUser = await UserRepository.createUser(userPayload);
      // after returning this user will take some data to create claims to return it
      // set some data to create claims
      // i will use it in jwt token in cart or checkout
      const claim = {
        userid: createdUser._id,
        username: `${createdUser.first_name} ${createdUser.last_name}`, // Combine first and last names
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        email: createdUser.email,
        password: hashedPassword,
        salt,
        role: createdUser.role,
      };

      return claim;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Email already exists");
      }
      console.error(error.message);
      throw new Error("Failed to create user", error.message);
    }
  },
  getUserById: async (userId) => {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  },
  // this method will return user by email
  // need to set some of validation cases
  //
  getuserbyemail: async (email) => {
    const user = await UserRepository.findUserByEmail(email);
    // if user not found will throw error
    if (!user) throw new Error("User not found");
    return user;
  },
  getallusers: async () => {
    const allusers = await UserRepository.findallusers();
    if (!allusers) throw new Error("WTF");
    return allusers;
  },

  // user it in login
  authenticateUser: async (email, password) => {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    return user;
  },
  updateUser: async (userId, updateData) => {
    return await UserRepository.updateUser(userId, updateData);
  },
  deleteUserById: async (userId) => {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    return await UserRepository.deleteUser(userId);
  },
};

module.exports = UserService;
