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
        console.log("------------------------------------")
        const { token , user} = await loginUser({ email, password });
        console.log(token)
        console.log(user)
        console.log("------------------------------------")


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

