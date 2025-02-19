const mongoose = require("mongoose");


const cashierNameSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customername: {
    type: cashierNameSchema,
    required: true,
  },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    type: shippingSchema,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Vodafone Cash", "cash"],
    required: true,
  },
  paymentCode: {
    type: String,
    default: null,
  },
  orderStatus: {
    type: String,
    enum: ["delivered", "canceled"],        
    default: "delivered",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);


