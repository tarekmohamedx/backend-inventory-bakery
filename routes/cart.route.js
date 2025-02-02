const express = require('express');
const cartController = require('../controllers/cart.controller');

const router = express.Router();


// router.post('/', cartController.createCart)
router.post('/items', cartController.addToCart)
router.put('/update/:id', cartController.updateCartItemQuantity)
router.delete('/items/:id', cartController.removeCartItem)
router.delete("/clear", cartController.clearCart);

router.get('/user/:id',cartController.getUserCart)




module.exports = router;