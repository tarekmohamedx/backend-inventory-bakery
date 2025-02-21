const Inventory = require('../models/inventory.model');
const Branch = require('../models/branchinventory.model'); 

module.exports.GetInventoryData = async()=>{
     const inventory = await Inventory.find().populate({
       path: "products.productId",
       strictPopulate: false,
     });

     const populatedProducts = inventory
       .map(
         (inv) => inv.products.map((p) => p.productId) 
       )
       
       .flat(); // Flatten if needed

     return populatedProducts;

}

module.exports.getBranchInfo = async(branchId)=>{
     return await Branch.Branch.findOne({_id:branchId}).populate('clerks').populate('cashiers')
}

module.exports.getAllBranches = async()=>{
     return await Branch.Branch.find();
}


