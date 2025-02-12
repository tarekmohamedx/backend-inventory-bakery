const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewere/authentication.middlewere');
const userService = require('../services/users.service');
const authorize = require('../middlewere/authorization.middlewere');
const adminService = require('../services/admin.users.services')

const getUsers = async (req, res)=>{
    const users = await userService.getUsers();
    res.status(200).json({
        users
    })
}

const getUserByRole = async (req, res)=>{
    try{
        const {role} = req.params;
        const usersRoles = await adminService.getUserByRole(role);
        return res.status(200).json({
            data: usersRoles
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
                message: "User has been deleted"
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


router.get('/dashboard', async (req, res) => {
    res.status(200).json({ success: true, data: "Admin Dashboard" });
});

router.get('/users',verifyToken, authorize('Admin') ,getUsers);
router.get('/users/:role', getUserByRole)
router.get('/user/:userId', getUserById)
router.delete('/users/:userId', removeUser)
router.put('/users/:userId', updateUser)


module.exports = router;
