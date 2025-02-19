const Inventory = require('../models/inventory.model');


module.exports.GetInventoryData = async()=>{
     return await Inventory.find().populate('productId');
}







