const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    stockIn: { type: Number, default: 0 },
    stockOut: { type: Number, default: 0 },
    stockRecord: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  });
   
module.exports = mongoose.model('Inventory', inventorySchema);