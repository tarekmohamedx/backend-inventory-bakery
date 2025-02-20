const { registerUser, loginUser , decode } = require("../services/auth.service");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { mergeGuestCart } = require('../services/cart.service')

const routes = {
  register: async (req, res) => {
    try {
      userbody = req.body;

      console.log("userbody", userbody);
      // Call registerUser service to handle user registration and get the token
      const { token } = await registerUser(userbody);

      req.session.token = token;
      // Send success response with the token
      
      res.status(201).json({ success: true, token });
    } catch (error) {
      console.error("Error in register:", error.message);
      res
        .status(500)
        .json({ message:error.message || "Failed to register user" });  
    }

  },

    login: async (req, res) => {
      try {
        const { email, password , guestCart = []} = req.body; // Directly use the entire body as user credentials

        // Call loginUser service to handle user login and get the token
        const { token , user} = await loginUser({ email, password });

      // **🔄 Merge Guest Cart with User's Cart**
      const updatedCart = await mergeGuestCart(user._id, guestCart);  // Call mergeGuestCart
      console.log("✅ Merged Cart:", updatedCart);

        // Send success response with the token
        res.status(200).json({ token });
      } catch (error) {
        console.error("Error in login:", error.message);
        res
          .status(500)
          .json({ message: error.message || "Failed to login user" });
      }
    },


}


router.post("/auth/register", routes.register);
router.post("/auth/login", routes.login);
// router.get('/auth/decode',routes.decoding);
module.exports = router;





// const appError = require('../utils/appError');
// const httpStatusText = require('../utils/httpStatusText');
// const asyncwrapper = require('../middlewere/asyncWrapper');
// const bcrypt = require('bcrypt');
// const Users = require('../models/users.model');
// const jwt = require('jsonwebtoken');

// const getAllUser = asyncwrapper(async (req, res, next) => {
//     const query = req.query;
//     const limit = query.limit || 10;
//     const page = query.page || 1;
//     const skip = (page - 1) * limit;
//     const users = await Users.find({}, { "__v": false }).limit(limit).skip(skip);
//     res.json({ status: httpStatusText.SUCCESS, data: { users } });
// });

// const Register = asyncwrapper(async (req, res, next) => {
//     const { firstName, lastName, email, password ,role} = req.body;

//     const oldUser = await Users.findOne({ email: email });
//     if (oldUser) {
//         const error = appError.create('User already exists', 400, httpStatusText.FAIL);
//         return next(error);
//     }

//     //! Password hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new Users({
//         firstName,
//         lastName,
//         email,
//         password: hashedPassword,
//         role,
//     });
//       //generate token
//     const token= await jwt.sign({ email:newUser.email,id:newUser._id,role:newUser.role} , process.env.JWT_SECRET_KEY,{expiresIn:'50d'});
//     console.log('token',token);
//     newUser.token=token;


//     await newUser.save();
//     res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
// });

// const Login = asyncwrapper(async (req, res, next) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         const error = appError.create('Email and password are required', 400, httpStatusText.FAIL);
//         return next(error);
//     }

//     const user = await Users.findOne({ email: email });
//     if (!user) {
//         const error = appError.create('Invalid email or password', 400, httpStatusText.FAIL);
//         return next(error);
//     }

//     const matchedPassword = await bcrypt.compare(password, user.password);
//     if(user && matchedPassword){
//         //logged in successfully
//         const token= await jwt.sign({ email:user.email,id:user._id,role:user.role} , process.env.JWT_SECRET_KEY,{expiresIn:'50d'});
//         res.json({status:httpStatusText.SUCCESS,data:{token:user.token}})
//     }
//     else{
//         const error =appError.create('Something Wrong',500,httpStatusText.ERROR);
//         return next(error);
//     }
// });

// module.exports = {
//     getAllUser,
//     Register,
//     Login
// };

// --------------------------------------------------------------------------------------------/
// const Users=require('../models/users.model');
// const appError = require('../utils/appError');
// const httpStatusText = require('../utils/httpStatusText')
// const asyncwrapper = require('../utils/asyncWrapper');
// const bcrypt = require('bcrypt');
// const appError = require('../utils/appError');


// const getAllUser=asyncwrapper(async(req,res)=>{
//     const query =req.query;
//     const limit =query.limit||10;
//     const page =query.page||1;
//     const skip =(page-1)*limit;
//      const Users = await User.find({},{"_v":false,'password':false}).limit(limit).skip(skip);
//      res.json({status:httpStatusText.SUCCESS,data:{Users}})

// })

// const Register=asyncwrapper(async(req,res)=>{
//     const {firstName,lastName,email,password} =req.query;
    
//     const User =await User.findone({email:email})
//      if(oldUser){
//         const error =appError.create('user already exist',400,httpStatusText.FAIL);
//     return next(error);
//     })

//     //!password hashing
// const hashedPassword = await bcrypt.hash(password,10);


//     const NewUser = new User({
//       firstName,
//       lastName,
//       email,
//       password:hashedPassword,
//        })
//     NewUser.save();
//     res.status(201).json({status:httpStatusText.SUCCESS,data:{user :NewUser}})
    

// const Login=asyncwrapper(async(req,res)=>{

//     const {email,password} =req.query;
//     if(!email && !password){
//     const error =appError.create(' email and password are required' ,400,httpStatusText.FAIL); 
//     return next(error);
//     }

//     const user =await  User.findone({email:email}); //find user by email
//     const matchedpassword =await bcrypt.compare(password,user.password); //compare password

//     if(user && matchedpassword){
//         res.json({status:httpStatusText.SUCCESS,data:{user:'user logged in successfully'}})
//     }
//     else{
//         const error =appError.create('invalid email or password',400,httpStatusText.FAIL);
//         return next(error);
//     }
// })


// module.exports={

//     getAllUser,Register,Login
// }const Users = require('../models/users.model');

