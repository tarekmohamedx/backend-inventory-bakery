const userRepo = require('../repos/users.repo');
const productRepo = require('../repos/product.repo');
const { calculateTotal } = require('../utils/cartUtils');
const mongoose = require("mongoose");
const Product = require("../models/Product.model");
// const User = require("../models/users.model");

exports.addToCart = async (userId, productId, quantity) => {
  // catch id from token after decode it rom session 
  const user = await userRepo.getUserById(userId); // return user so i catch his cart  
  if (!user) throw new Error("User not found");

  const existingCartItem = user.cartItems.find((item) => item.productId == productId);  // if item already exist or not if exist increase quantity 
  const product = await productRepo.getProductById(productId); 
  const price = product.price;
  
  if (existingCartItem) {
    existingCartItem.quantity += quantity;  
  } else {
    user.cartItems.push({ productId, quantity, price }); // uncle bob said : if code having any comments this code not follow clean code 
    console.log('price case');   
    
  }
  await user.save();
  return user.cartItems;
};


exports.getUserCart = async (userId) => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  
    const cart = user.cartItems;
    console.log(cart);
    
    const total = calculateTotal(cart);
  
    return {
      userId,
      items: cart,
      total,
    };
  };

// exports.getUserCart = async (userId) => {
//   const user = await userRepo.getUserById(userId);
//   if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 404;
//       throw error;
//   }

//   let cart = user.cartItems || [];
//   const filteredCart = [];
//   for (let item of cart) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//           filteredCart.push(item);
//       }
//   }
//   if (filteredCart.length !== cart.length) {
//       user.cartItems = filteredCart;
//       await user.save();
//   }

//   const total = calculateTotal(filteredCart);

//   return {
//       userId,
//       items: filteredCart,
//       total,
//   };
// };

  exports.updateCartItemQuantity = async (userId, productId, quantity) => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  
    const cartItem = user.cartItems.find((item) => item.productId == productId);
    if (!cartItem) {
      const error = new Error("Item does not exist in cart");
      error.statusCode = 404;
      throw error;
    }
  
    cartItem.quantity = quantity;
    await user.save();
  
    return user.cartItems;
  };


  exports.removeCartItem = async (userId, itemId) => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  
   const itemIndex = user.cartItems.findIndex((item) => item.productId == itemId);
    if (itemIndex === -1) {
      const error = new Error("Item not found in cart");
      error.statusCode = 404;
      throw error;
    }
  
    user.cartItems.splice(itemIndex, 1);
  
    await user.save();
  
    return user.cartItems;
  };


  exports.clearCart = async (userId) => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  
    user.cartItems = [];
  
    await user.save();
  
    return user.cartItems;
  };

  //---------------------------- Merge Guest Cart Service ------------------

// Merge guest cart with the user's cart
exports.mergeGuestCart = async (userId, guestCart) => {
  try {
    const user = await userRepo.getUserById(userId);  // Fetch user by ID
    if (!user) {
      throw new Error("User not found");
    }

    let updatedCart = [...user.cartItems];  // Start with the existing cart items

    // Merge guest cart items into the user's cart
    guestCart.forEach((guestItem) => {
      const guestProductId = mongoose.Types.ObjectId.isValid(guestItem.productId)
        ? new mongoose.Types.ObjectId(guestItem.productId)  // Convert to ObjectId
        : guestItem.productId;

      const existingItem = updatedCart.find((item) =>
        item.productId.toString() === guestProductId.toString()
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity; // Merge quantity if item exists
      } else {
        updatedCart.push({ ...guestItem, productId: guestProductId }); // Add new item to cart
      }
    });

    // Save the merged cart to the user model
    user.cartItems = updatedCart;
    await user.save();

    return updatedCart;  // Return the updated cart
  } catch (error) {
    console.error("Error merging guest cart:", error);
    throw error;
  }
};
