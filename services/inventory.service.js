const Inventory = require('../models/inventory.model');
const Branch = require('../models/branchinventory.model');
const Restock = require('../models/Restock.model')

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

module.exports.getBranchStock = async(branchId)=>{
  return await Branch.BranchInventory.find({branchId}, {_id:0, branchId:0, cashier:0, clerk:0})
    .populate('productId', 'name description images');
}

module.exports.getBranchInfo = async(branchId)=>{
  return await Branch.Branch.findOne({_id:branchId}).populate('clerks').populate('cashiers')
}

module.exports.getAllBranches = async()=>{
  return await Branch.Branch.find();
}


module.exports.requestStock = async(branchId, productId, quantity)=>{
  try {
    if (!branchId || !productId || !quantity) {
        throw new Error('Invalid data');
    }

    const reqstock = new Restock({
        branchId:branchId,
        productId:productId,
        quantity: quantity
    });

    await reqstock.save();

    return reqstock;
} catch (error) {
    console.error('Stock request failed:', error);
    throw error;
}
}

module.exports.getAllRequests = async()=>{
  try {
    return await Restock.find({},{__v:0})
      .populate('branchId', 'location name');
    
    }catch (error){}

}


