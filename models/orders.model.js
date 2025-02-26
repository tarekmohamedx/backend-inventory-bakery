const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  country: { type: String, default: "Egypt", required: false },
  governorate: { type: String, required: true },
  city: { type: String, required: true },
});

const customerNameSchema = new mongoose.Schema({
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
    type: customerNameSchema,
    required: true,
  },
  totalAmount: { type: Number, required: true },
  profit:{type:Number},
  shippingAddress: {
    type: shippingSchema,
    required: true,
  },
  addressdetails: { type: String, require: true },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Vodafone Cash"],
    required: true,
  },
  paymentCode: {
    type: String,
    default: null,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
