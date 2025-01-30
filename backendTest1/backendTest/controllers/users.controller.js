const  userService  = require('../services/users.service');


module.exports = (() => {
    const router = require("express").Router();
  
    // get users
    router.get("/users", async (req, res, next) => {
      try{
        const users = await userService.getUsers();
        res.status(200).json(users);
      }catch(error){
        res.status(500).json({ error: error.message });
      }
    });
  
  
    // get user detail
    router.get("/users/:id", async (req, res) => {
      try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: error.message });
      }
    });
    
  
    // create user
    router.post("/users", async(req, res, next) => {
      try{
        const new_user = await userService.createUser(req.body);
        res.status(201).json(new_user);
      }catch(error){
        res.status(500).json({ error: error.message });
      }
    });
  
  
    // update user
    router.put("/users/:id", async(req, res, next) => {
      try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
          return res.status(404).json({ error: "This user does not exist :(" });
        }
        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: error.message });
      }
    });
  
  
    // Soft remove account ( delete user account )
    router.delete("/users/:id/soft-delete", async (req, res) => {
      try {
        const softDeleteUser = await userService.softDelete(req.params.id);
        if (!softDeleteUser) {
          return res.status(404).json({ error: "This user does not exist :(" });
        }
        res.status(200).json({ message: "User account deactivated successfully" });
      } catch (error) {
        console.error("Error soft deleting user:", error);
        res.status(500).json({ error: error.message });
      }
    });
    
  
    // delete user
    router.delete("/users/:id", async (req, res) => {
      try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
          return res.status(404).json({ error: "This user does not exist :(" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: error.message });
      }
    });
  
  
    return router;
  })();
  