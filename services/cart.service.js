const userRepo = require('../repos/users.repo');
const { calculateTotal } = require('../utils/cartUtils');

exports.addToCart = async (userId, productId, quantity, price) => {
  const user = await userRepo.getUserById(userId);
  if (!user) throw new Error("User not found");

  const existingCartItem = user.cartItems.find((item) => item.productId == productId);

  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    user.cartItems.push({ productId, quantity, price });
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
    const total = calculateTotal(cart);
  
    return {
      userId,
      items: cart,
      total,
    };
  };

  exports.updateCartItemQuantity = async (userId, itemId, quantity) => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  
    const cartItem = user.cartItems.find((item) => item.productId == itemId);
    if (!cartItem) {
      const error = new Error("Item does not exist in cart");
      error.statusCode = 404;
      throw error;
    }
  
    cartItem.quantity += quantity;
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