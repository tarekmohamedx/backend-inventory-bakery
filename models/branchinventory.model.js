const mongoose = require("mongoose");

// Branch Schema
const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Branch name
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    clerks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Employees handling stock
    cashiers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Employees handling transactions
  },
  { timestamps: true }
);

// Branch Inventory Schema
const branchInventorySchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    }, // Reference to Branch

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }, // Reference to Product

    stockIn: { type: Number, default: 0 }, // Products added to inventory
    stockOut: { type: Number, default: 0 }, // Products removed from inventory
    price: { type: Number, required: true }, // Product price per unit

    clerk: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Employee handling stock
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Cashier managing transactions

    capacity: { type: Number, required: true }, // Max number of items branch can store
    currentStock: { type: Number, default: 0 }, // Tracks current stock level
  },
  { timestamps: true }
);

/**
 * Pre-save hook: Ensure stock does not exceed capacity
 */
branchInventorySchema.pre("save", function (next) {
  if (this.currentStock > this.capacity) {
    return next(
      new Error(`Cannot exceed inventory capacity of ${this.capacity} units.`)
    );
  }
  next();
});

// Export models
module.exports = {
  Branch: mongoose.model("Branch", branchSchema),
  BranchInventory: mongoose.model("BranchInventory", branchInventorySchema),
};

/*
mansoure 

objid == 2 ,
pid == 2 , []         
stockin ==  50 

stockout == 10, 
price == 200 
clerk == 2 
cashier == 2 

******************








*/
