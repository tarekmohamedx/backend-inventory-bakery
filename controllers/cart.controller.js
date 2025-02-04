const cartService = require("../services/cart.service");
const httpStatusText = require("../utils/httpStatusText");
const userRepo = require('../repos/users.repo');
const User = require('../models/users.model');
const { verifyToken } = require('../utils/jwttoken.maneger');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authMiddlewere = require('../middlewere/authentication.middlewere');



module.exports = (() => {

  const router = require("express").Router();

  // add
  router.post('/items',async (req, res) => {
    try {
      const { userId, productId, quantity} = req.body;

      if (quantity <= 0) {
        return res.status(400).json({
          status: httpStatusText.FAIL,
          message: "Quantity must be greater than zero",
        });
      }

      const updatedCart = await cartService.addToCart(userId, productId, quantity);

      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: updatedCart,
      });
    } catch (err) {
      return res.status(500).json({
        status: httpStatusText.ERROR,
        message: err.message,
      });
    }
  });


  // Add product to cart
router.post('/cart/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.user.userid; // Use correct userId from token

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert productId to ObjectId before inserting into MongoDB
    const objectIdProduct = new mongoose.Types.ObjectId(productId);

    const existingItem = user.cartItems.find(item => item.productId.equals(objectIdProduct));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({ productId: objectIdProduct, quantity, price });
    }

    await user.save();

    const token = jwt.sign({ userid: user._id, cartItems: user.cartItems }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: 'Cart updated successfully', cartItems: user.cartItems, token });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: "Server error" });
  }
});


  // get user cart
  router.get('/user/:id', authMiddlewere,async (req, res) => {
    try {
      const userId = req.params.id;
      const cartData = await cartService.getUserCart(userId);
  
      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: cartData,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        status: httpStatusText.ERROR,
        message: err.message,
      });
    }
  });


  // update
  router.put('/update/:id', async (req, res) => {
      try {
        const itemId = req.params.id;
        const { userId, quantity } = req.body;
    
        if (quantity <= 0) {
          return res.status(400).json({
            status: httpStatusText.FAIL,
            message: "Quantity must be greater than zero",
          });
        }
    
        const updatedCart = await cartService.updateCartItemQuantity(userId, itemId, quantity);
    
        return res.status(200).json({
          status: httpStatusText.SUCCESS,
          data: updatedCart,
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({
          status: httpStatusText.ERROR,
          message: err.message,
        });
      }
  });


  // delete
  router.delete('/items/:id', async(req, res)=>{
      try{
        const productId = req.params.id;
        const userId = req.query.userId;
        const user = await userRepo.getUserById(userId);
          if(!user){
              return res.status(400).json({
                  status: httpStatusText.FAIL,
                  message: "user not found"})
          }

      const itemIndex = user.cartItems.findIndex((item)=> item.productId == productId);
      if(itemIndex == -1)
          return res.status({status: httpStatusText.FAIL, message: "item does not exist"});
      user.cartItems.splice(itemIndex, 1)
      

      await user.save();
          return res.status(200).json({ status: httpStatusText.SUCCESS, data: user.cartItems})
      }catch(err){
          return res.status(400)
                  .json({
                      status: httpStatusText.ERROR,
                      message: err.message
                  })
      }                
  });


  // clear
  router.delete("/clear/:id", async (req, res) => {
      try {
        const userId = req.params.id;        
        const updatedCart = await cartService.clearCart(userId);
    
        return res.status(200).json({
          status: httpStatusText.SUCCESS,
          data: updatedCart,
        });
      } catch (err) {
        return res.status(err.statusCode || 500).json({
          status: httpStatusText.ERROR,
          message: err.message,
        });
      }
  });

  return router;
})();