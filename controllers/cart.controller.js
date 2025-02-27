const cartService = require("../services/cart.service");
const httpStatusText = require("../utils/httpStatusText");
const userRepo = require('../repos/users.repo');
const User = require('../models/users.model');
const { verifyToken } = require('../utils/jwttoken.maneger');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product.model')
const Branch = require('../models/branchinventory.model').Branch;
const BranchInventory = require('../models/branchinventory.model').BranchInventory;
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
  router.post("/cart/add", verifyToken, async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ status: httpStatusText.FAIL, message: "Invalid productId format" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ status: httpStatusText.FAIL, message: "Quantity must be greater than zero" });
        }

        // Check if the product exists
        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ status: httpStatusText.FAIL, message: "Product not found" });
        }
        ///new
        if (product.stock < quantity) {
          return res.status(400).json({ 
            status: httpStatusText.FAIL, 
            message: "Insufficient product stock" 
          });
        }
        // ----

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: httpStatusText.FAIL, message: "User not found" });
        }

        const existingItem = user.cartItems.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cartItems.push({ productId, quantity, price });
        }

        await user.save();

        ///new
        // Update branch inventory:
    // Assuming there's one inventory record per product.
    let inventory = await BranchInventory.findOne({ productId: productId });
    if (inventory) {
      // Increase stockOut and decrease currentStock
      inventory.stockOut = (inventory.stockOut || 0) + quantity;
      inventory.currentStock = (inventory.currentStock || 0) - quantity;
      await inventory.save();
    } else {
      console.warn("No branch inventory record found for productId:", productId);
    }

    // Decrease the overall product stock
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
        //----

        // Update JWT with the new cart
        const token = jwt.sign({ userId: user._id, cartItems: user.cartItems }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ status: httpStatusText.SUCCESS, cartItems: user.cartItems, token });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ status: httpStatusText.ERROR, message: "Server error" });
    }
});

  // get user cart
  router.get('/user/:id',async (req, res) => {
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



//   // update
//   router.put('/update/:id', async (req, res) => {
//     try {
//       const itemId = req.params.id;
//       const { userId, quantity } = req.body;
  
//       if (quantity <= 0) {
//         return res.status(400).json({
//           status: httpStatusText.FAIL,
//           message: "Quantity must be greater than zero",
//         });
//       }
  
//       const updatedCart = await cartService.updateCartItemQuantity(userId, itemId, quantity);
  
//       return res.status(200).json({
//         status: httpStatusText.SUCCESS,
//         data: updatedCart,
//       });
//     } catch (err) {
//       return res.status(err.statusCode || 500).json({
//         status: httpStatusText.ERROR,
//         message: err.message,
//       });
//     }
// });

router.put('/update/:id', async (req, res) => {
  try {
    const itemId = req.params.id; // The product ID in the cart item
    const { userId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: "Quantity must be greater than zero",
      });
    }

    // Find the user and the specific cart item
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "User not found",
      });
    }

    const cartItem = user.cartItems.find(item => item.productId.equals(itemId));
    if (!cartItem) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "Cart item not found",
      });
    }

    // Calculate the change in quantity (delta)
    const oldQuantity = cartItem.quantity;
    const delta = quantity - oldQuantity;

    // Check product stock if we're increasing quantity
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "Product not found",
      });
    }
    if (delta > 0 && product.stock < delta) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: "Insufficient product stock",
      });
    }

    // Update the cart item quantity
    cartItem.quantity = quantity;
    await user.save();

    // Update branch inventory for this product
    let inventory = await BranchInventory.findOne({ productId: itemId });
    if (inventory) {
      if (delta > 0) {
        // Increasing quantity: more items are leaving inventory.
        inventory.stockOut -= delta;
        inventory.currentStock -= delta;
      } else if (delta < 0) {
        // Decreasing quantity: return items to inventory.
        // (Since delta is negative, subtracting delta adds its absolute value)
        inventory.stockOut += delta; // delta is negative, so stockOut decreases.
        inventory.currentStock -= delta; // currentStock increases.
      }
      await inventory.save();
    } else {
      console.warn("No branch inventory record found for productId:", itemId);
    }

    // Update the overall product stock accordingly.
    // If delta is positive, subtract from product stock; if negative, add back.
    await Product.findByIdAndUpdate(itemId, { $inc: { stock: -delta } });

    // Optionally, update the JWT with the new cart data.
    const token = jwt.sign(
      { userId: user._id, cartItems: user.cartItems },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: user.cartItems,
      token,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(err.statusCode || 500).json({
      status: httpStatusText.ERROR,
      message: err.message,
    });
  }
});





//   // delete
//   router.delete('/items/:id', async(req, res)=>{
//     try{
//       const productId = req.params.id;
//       const userId = req.query.userId;
//       const user = await userRepo.getUserById(userId);
//         if(!user){
//             // return res.status(400).json({
//             //     status: httpStatusText.FAIL,
//             //     message: "user not found"})
//             updatedCart = await cartService.removeFromGuestCart(productId);
//         }

//     const itemIndex = user.cartItems.findIndex((item)=> item.productId == productId);
//     if(itemIndex == -1)
//         return res.status({status: httpStatusText.FAIL, message: "item does not exist"});
//     user.cartItems.splice(itemIndex, 1)
    

//     await user.save();
//         return res.status(200).json({ status: httpStatusText.SUCCESS, data: user.cartItems})
//     }catch(err){
//         return res.status(400)
//                 .json({
//                     status: httpStatusText.ERROR,
//                     message: err.message
//                 })
//     }                
// });


  // // clear
  // router.delete("/clear/:id", async (req, res) => {
  //     try {
  //       const userId = req.params.id;        
  //       // const updatedCart = await cartService.clearCart(userId);
    
  //       let updatedCart;
  //       if (userId) {
  //         // Logged-in user: Clear user's cart
  //         updatedCart = await cartService.clearCart(userId);
  //       } else {
  //         // Guest: Clear guest cart
  //         updatedCart = await cartService.clearGuestCart();
  //       }
  //       return res.status(200).json({
  //         status: httpStatusText.SUCCESS,
  //         data: updatedCart,
  //       });

  //     } catch (err) {
  //       return res.status(err.statusCode || 500).json({
  //         status: httpStatusText.ERROR,
  //         message: err.message,
  //       });
  //     }
  // });

  ///delete

  router.delete('/items/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.query.userId;
      
      // Get the user (or guest cart if user not found)
      const user = await userRepo.getUserById(userId);
      if (!user) {
        // For guests, remove from guest cart.
        const updatedCart = await cartService.removeFromGuestCart(productId);
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: updatedCart });
      }
      
      // Find the index of the cart item that matches the productId
      const itemIndex = user.cartItems.findIndex(item => item.productId == productId);
      if (itemIndex === -1) {
        return res.status(400).json({ status: httpStatusText.FAIL, message: "Item does not exist" });
      }
      
      // Get the quantity of the item to be removed
      const removedItem = user.cartItems[itemIndex];
      const quantity = removedItem.quantity;
      
      // Remove the item from the user's cart
      user.cartItems.splice(itemIndex, 1);
      await user.save();
      
      // Update branch inventory: decrease stockOut and increase currentStock by the removed quantity
      const inventory = await BranchInventory.findOne({ productId: productId });
      if (inventory) {
        inventory.stockOut = (inventory.stockOut || 0) - quantity;
        inventory.currentStock = (inventory.currentStock || 0) + quantity;
        await inventory.save();
      } else {
        console.warn("No branch inventory record found for productId:", productId);
      }
      
      // Update the overall product stock: increase the product stock by the removed quantity
      await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
      
      return res.status(200).json({ status: httpStatusText.SUCCESS, data: user.cartItems });
    } catch (err) {
      console.error("Error removing cart item:", err);
      return res.status(400).json({
        status: httpStatusText.ERROR,
        message: err.message
      });
    }
  });
  

  ///clear
  router.delete("/clear/:id", async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          status: httpStatusText.FAIL, 
          message: "User not found" 
        });
      }
  
      // Iterate over each cart item to reverse inventory and product stock changes
      for (const cartItem of user.cartItems) {
        const { productId, quantity } = cartItem;
  
        // Update branch inventory: decrease stockOut and increase currentStock by quantity
        let inventory = await BranchInventory.findOne({ productId: productId });
        if (inventory) {
          inventory.stockOut = (inventory.stockOut || 0) - quantity;
          inventory.currentStock = (inventory.currentStock || 0) + quantity;
          await inventory.save();
        } else {
          console.warn("No branch inventory record found for productId:", productId);
        }
  
        // Update the overall product stock: increase stock by quantity
        await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
      }
  
      // Clear the user's cart items
      user.cartItems = [];
      await user.save();
  
      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: user.cartItems, // Should be empty now
      });
  
    } catch (err) {
      console.error("Error clearing cart:", err);
      return res.status(err.statusCode || 500).json({
        status: httpStatusText.ERROR,
        message: err.message,
      });
    }
  });
  

  return router;
})();