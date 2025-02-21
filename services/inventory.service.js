const Inventory = require('../models/inventory.model');
const Branch = require('../models/branchinventory.model'); 

module.exports.GetInventoryData = async()=>{
     return await Inventory.find().populate('products.productId')
}

module.exports.getBranchStock = async(branchId)=>{
     return await Branch.BranchInventory.find({branchId}, {_id:0, branchId:0, cashier:0, clerk:0}).populate('productId');
}

module.exports.getBranchInfo = async(branchId)=>{
     return await Branch.Branch.findOne({_id:branchId}).populate('clerks').populate('cashiers')
}

module.exports.getAllBranches = async()=>{
     return await Branch.Branch.find();
}


