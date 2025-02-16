const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    branchid: { type: mongoose.Schema.Types.ObjectId, ref: 'branchinventory', required: true },
    productid: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
    quantiy:{type:Number},  
    Status:{type:String , enum: ['pending , approved , rejected'] ,  default:0},
});

module.exports = mongoose.model('Inventory', inventorySchema);

