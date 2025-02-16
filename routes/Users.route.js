const express = require('express');
const router = express.Router();
const UserControllers= require('../controllers/auth.controller');
const Users=require('../models/users.model');
const verifyToken = require('../middlewere/authorization.middlewere');



//get all users

// router.route('/')
//                .get(verifyToken,UserControllers.getAllUser)

//register

 router.route('/register')
               .post(UserControllers.Register)

 //login
 router.route('/login')
               .post(UserControllers.Login)


module.exports = router;