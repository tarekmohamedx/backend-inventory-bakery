const bcrypt = require("bcrypt");
const UserRepository = require("../repos/user2.repo");
const { model, Error } = require("mongoose");
const { getUserById } = require("./users.service");

const UserService = {
  createUser: async (userData) => {
    /*
    in register will catch some of attributes 
    first_name, last_name, email, password,
    */
   
    try {
      // Generate salt
      const salt = await bcrypt.genSalt(10);
      // put restriction on mail to input valid mail 
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error("Invalid email format");
  }
      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Prepare user data for creation
      const userPayload = {
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        password: hashedPassword,
        salt,
        role: userData.role,
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
        first_name: createdUser.firstName,
        last_name: createdUser.lastName,
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
  // getUserById: async (userId) => {
  //   const user = await UserRepository.findUserById(userId);
  //   if (!user) throw new Error("User not found");
  //   return user;
  // },
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
  /*
  in login i get password will pass it in param with pass after get it from user 

  
  */
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



  //UserProfile
//  getUserById:async(userId)=>{
//   return await UserRepository.findUserById(userId);
//  },
//  updateUser:async(userId,updateData)=>{
//   if(updateData.password){
//     const salt= await bcrypt.genSalt(10);
//     updateData.password = await bcrypt.hash(updateData.password, salt);
//   }
//   return await UserRepository.updateUser(userId,updateData);
//  }

getUserById: async (userId) => {
  const user = await UserRepository.findUserById(userId);
  if (!user) throw new Error('User not found');
  return user;
},

updateUser: async (userId, updateData) => {
  // Handle password update
  if (updateData.currentPassword && updateData.newPassword) {
    const user = await UserRepository.findUserById(userId);
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
  
  return await UserRepository.updateUser(userId, updateData);
}

};

module.exports = UserService;
