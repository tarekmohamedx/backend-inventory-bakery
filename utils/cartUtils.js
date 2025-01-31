exports.calculateTotal = (cart) => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };
  