const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    stockIn: { type: Number, default: 0 },
    stockOut: { type: Number, default: 0 },
    price:{type:Number , default:0 },
      
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: false },
    sellerID:{type:mongoose.Schema.Types.ObjectId , ref: 'User' , require:false}
  });
  
module.exports = mongoose.model('Inventory', inventorySchema);