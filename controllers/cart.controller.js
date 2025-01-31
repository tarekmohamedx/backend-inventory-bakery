const cartService = require("../services/cart.service");
const httpStatusText = require("../utils/httpStatusText");
const userRepo = require('../repos/users.repo');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, price } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: "Quantity must be greater than zero",
      });
    }

    const updatedCart = await cartService.addToCart(userId, productId, quantity, price);

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
};


const getUserCart = async (req, res) => {
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
  };

  const updateCartItemQuantity = async (req, res) => {
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
  };

  const removeCartItem = async(req, res)=>{
    const itemId = req.params.id;
    try{
        const {userId, quantity} = req.body;
            const user = await userRepo.getUserById(userId);
        if(!user){
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: "user not found"})
        }

     const itemIndex = user.cartItems.findIndex((item)=> item.productId == itemId);
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
}

const clearCart = async (req, res) => {
    try {
      const { userId } = req.body;
  
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
  };
module.exports = { 
    addToCart,
    updateCartItemQuantity,
    getUserCart,
    removeCartItem,
    clearCart
 };
