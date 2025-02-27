const Inventory = require('../models/inventory.model');
const Branch = require('../models/branchinventory.model');
const Restock = require('../models/Restock.model')
const productRepo = require('../repos/product.repo')
const mongoose = require("mongoose");
const OrderOffline = require('../models/OrderOffline.model');



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
      console.log(branchInventory);
      

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

// module.exports.getAllRequests = async()=>{
//   try {
//     return await Restock.find({},{__v:0})
//       .populate('branchId', 'location name');
    
//     }catch (error){}

// }

module.exports.getAllRequests = async () => {
  try {
    return await Restock.find({}, { __v: 0 })
      .populate("branchId", "name location") 
      .populate("productId", "name"); 
  } catch (error) {
    console.error("Error fetching restock requests:", error);
    throw error;
  }
};

module.exports.changeRequestStat = async(requestId, newStatus, message)=>{
  try {
    const reqUpdated = await Restock.findByIdAndUpdate(requestId, {Status:newStatus, responseMessage:message}, { new: true })
      // if(reqUpdated.Status == 'approved')
      //   this.transferToBranch(reqUpdated._id);
    return reqUpdated;
    }catch (err){
      throw new Error(err.message);
    }

}


module.exports.transferToMainInventory = async(productId)=>{
  try {
      const product = await productRepo.getProductById(productId);
      if (!product) throw new Error("Product not found");

      const sellerId = product.sellerId;

      const inventoryData = await Inventory.findOne({ sellerID: sellerId });
      if(inventoryData){
        const existingProduct = inventoryData.products.find(p => p.productId.equals(product._id));
        if (existingProduct) {
          console.log("Product already exists in inventory.");
          existingProduct.stockIn += product.stock;
        } else {
          console.log("Adding new product to inventory.");
          inventoryData.products.push({
            productId: product._id,
            stockIn: product.stock,
            price: product.price,
          });
        }
      
        await inventoryData.save();
        return;
      }
      else{
        const inventory = new Inventory({
          products: [
            {
              productId: product._id,
              stockIn: product.stock,
              price: product.price,
            },
          ],
          sellerID: product.sellerId,
        });
        await inventory.save();
        return;
      }
      
    return;

    }catch (err){
      throw new Error(err.message);
    }

}


module.exports.transferToBranch = async (requestId) => { 
  try {
    const request = await Restock.findById(requestId);
    if (!request) return { status: 404, message: "Request not found" };

    const product = await productRepo.getProductById(request.productId);
    if (!product) return { status: 404, message: "Product not found" };

    const sellerId = product.sellerId;
    const inventoryData = await Inventory.findOne({ sellerID: sellerId });
    if (!inventoryData) return { status: 404, message: "Inventory not found" };

    const foundProduct = inventoryData.products.find(productItem => productItem.productId.equals(request.productId));
    if (!foundProduct) return { status: 404, message: "Product does not exist in the Inventory." };

    if (request.quantity > foundProduct.stockIn) {
      request.Status = 'pending';
      await request.save();
      return { status: 400, message: "Not enough stock in Inventory for this product" };

    }

    const branchData = await Branch.BranchInventory.findOne({
      branchId: request.branchId,
      productId: request.productId,
    });

    if (!branchData) return { status: 404, message: "Branch data was not found!" };

    branchData.stockIn += request.quantity;
    await branchData.save();

    foundProduct.stockIn -= request.quantity;
    await inventoryData.save();

    request.Status = "approved";
    request.responseMessage = "Requested Stock has been transferred";
    await request.save();

    return { status: 200, message: request.responseMessage };

  } catch (err) {
    console.error("Error in transferToBranch:", err);
    return { status: 500, message: err.message };
  }
};


module.exports.getRequestsForBranch = async(branchId)=>{
  try {
    const requests = await Restock.find({branchId:branchId});
    return {
       status: 200, 
        requests
     };

  } catch (err) {
    console.error("Error in transferToBranch:", err);
    return { status: 500, message: err.message };
  }
}

