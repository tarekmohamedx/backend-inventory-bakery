const mongoose = require("mongoose");
const inventorySchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        stockIn: { type: Number, default: 0 },
        stockOut: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
      },
    ],
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }, // Optional
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
