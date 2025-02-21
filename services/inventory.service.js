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

// module.exports.getBranchStock = async(branchId)=>{
//   return await Branch.BranchInventory.find({branchId}, {_id:0, branchId:0, cashier:0, clerk:0}).populate('productId');
// }

module.exports.getBranchStock = async (branchId) => {
  try {
    const branchInventory = await Branch.BranchInventory.find({ branchId })
      .populate(
        "productId",
        "name description price sales stock status createdAt"
      )
      .populate("clerk", "name") // Optional: Populate clerk details
      .populate("cashier", "name"); // Optional: Populate cashier details

    if (!branchInventory || branchInventory.length === 0) {
      return { message: "No products found for this branch", products: [] };
    }

    // Extracting product details along with capacity
    const products = branchInventory.map((item) => ({
      _id: item.productId?._id || null,
      name: item.productId?.name || "Unknown Product",
      description: item.productId?.description || "",
      price: item.price,
      stockIn: item.stockIn,
      stockOut: item.stockOut,
      sales: item.productId?.sales || 0,
      stock: item.productId?.stock || 0,
      status: item.productId?.status || "Unavailable",
      createdAt: item.productId?.createdAt || null,
      capacity: item.capacity, // Including capacity
      currentStock: item.currentStock, // Including current stock level
    }));

    return {
      branchId,
      capacity: branchInventory[0]?.capacity || 0, // Return the capacity of the first item (assuming all products share branch capacity)
      products,
    };
  } catch (error) {
    console.error("Error fetching products by branch ID:", error);
    throw error;
  }
};


module.exports.getBranchInfo = async(branchId)=>{
  return await Branch.Branch.findOne({_id:branchId}).populate('clerks').populate('cashiers')
}

module.exports.getAllBranches = async()=>{
  return await Branch.Branch.find();
}