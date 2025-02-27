const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewere/authentication.middlewere');
const userService = require('../services/users.service');
const authorize = require('../middlewere/authorization.middlewere');
const adminService = require('../services/admin.users.services');
const dashboardService = require('../services/dashboard.service');

const getUsers = async (req, res)=>{
    const users = await userService.getUsers();
    res.status(200).json({
        users
    })
}

const getUserByRole = async (req, res)=>{
    try{
        const {role} = req.params;
        const users = await adminService.getUserByRole(role);
        return res.status(200).json({
           users
        })    
    }
    catch(err){
        return res.status(400).json({
            message: err.message
        })
    }
    
}

const removeUser = async(req, res)=>{
        try{
            const {userId} = req.params;
            const response = await adminService.removeUser(userId);
            return res.status(200).json({
                response,
                message: response
            })            
        }
        catch(err){
            return res.status(400).json({
                message: err.message
            })
        }
}

const getUserById = async(req, res)=>{
    const {userId} = req.params;
    console.log(userId);
    
    try{
       const user = await userService.getUserById(userId);
       console.log(user);
       
       if(user)
        return res.status(200).json({user})
    else 
         return res.status(401).json({message: "user not found"})
    }
    catch(err){
        return res.status(400).json({
            err
        })
    }

}
const updateUser = async(req, res)=>{
    const {userId} = req.params;
    const data = req.body;
    try{
        const updatedUser = await userService.updateUser(userId, data);
        res.status(200).json({
            updateUser
        })
    }
    catch(err){
        return res.status(400).json({
            err
        })
    }

}

const getDashboardStats = async(req, res)=>{
    try{
        const pendingOrders = (await dashboardService.pendingOrders()).length;
        const totalMoney = (await dashboardService.totalMoney())[0].totalRevenue;
        const latestOrders = await dashboardService.lastestOrders();
        const customers = await dashboardService.customersCount();
        const topProducts = await dashboardService.mostSellingProducts();
        return res.status(200).json({
            pendingOrders,
            totalMoney,
            latestOrders,
            customers,
            topProducts
        })
    }catch(err){
        return res.status(400).json({
            err
        })
    }

}



router.get('/users',getUsers);
router.get('/users/:role', getUserByRole)
router.get('/user/:userId', getUserById)
router.delete('/users/:userId', removeUser)
router.put('/users/:userId', updateUser)
router.get('/dashboard/stats', getDashboardStats);


module.exports = router;
