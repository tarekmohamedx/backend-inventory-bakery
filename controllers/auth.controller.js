const { registerUser, loginUser , decode } = require("../services/auth.service");
const router = require("express").Router();

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
        const { email, password } = req.body; // Directly use the entire body as user credentials

        // Call loginUser service to handle user login and get the token
        const { token } = await loginUser({ email, password });

        // Send success response with the token
        res.status(200).json({ token });
      } catch (error) {
        console.error("Error in login:", error.message);
        res
          .status(500)
          .json({ message: error.message || "Failed to login user" });
      }
    },

    // decoding:async(req , res) => {
    //   try{

      //   const token = req.body.token;
      //   const { s }= await decode({token});
      //   res.status(200).json({s});
      // }catch(error){
      //    res
      //      .status(500)
      //      .json({ message: error.message || "error when decoding" });
      // }
    }


router.post("/auth/register", routes.register);
router.post("/auth/login", routes.login);
// router.get('/auth/decode',routes.decoding);
module.exports = router;
