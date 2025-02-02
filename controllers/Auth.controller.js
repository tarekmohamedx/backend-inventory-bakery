
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const asyncwrapper = require('../middlewere/asyncWrapper');
const bcrypt = require('bcrypt');
const Users = require('../models/users.model');
const jwt = require('jsonwebtoken');

const getAllUser = asyncwrapper(async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await Users.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const Register = asyncwrapper(async (req, res, next) => {
    const { firstName, lastName, email, password ,role} = req.body;

    const oldUser = await Users.findOne({ email: email });
    if (oldUser) {
        const error = appError.create('User already exists', 400, httpStatusText.FAIL);
        return next(error);
    }

    //! Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    });
      //generate token
    const token= await jwt.sign({ email:newUser.email,id:newUser._id,role:newUser.role} , process.env.JWT_SECRET_KEY,{expiresIn:'50d'});
    console.log('token',token);
    newUser.token=token;


    await newUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const Login = asyncwrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create('Email and password are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const user = await Users.findOne({ email: email });
    if (!user) {
        const error = appError.create('Invalid email or password', 400, httpStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if(user && matchedPassword){
        //logged in successfully
        const token= await jwt.sign({ email:user.email,id:user._id,role:user.role} , process.env.JWT_SECRET_KEY,{expiresIn:'50d'});
        res.json({status:httpStatusText.SUCCESS,data:{token:user.token}})
    }
    else{
        const error =appError.create('Something Wrong',500,httpStatusText.ERROR);
        return next(error);
    }
});

module.exports = {
    getAllUser,
    Register,
    Login
};


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