const Inventory = require('../models/inventory.model');
const Branch = require('../models/branchinventory.model');
const Restock = require('../models/Restock.model')
const productRepo = require('../repos/product.repo')
const mongoose = require("mongoose");
const OrderOffline = require('../models/OrderOffline.model');

// module.exports.GetInventoryDatafinal = async () => {
//   try {
//     const inventoryDocs = await Inventory.find().populate({
//       path: "products.productId",
//       model: "Product",
//       strictPopulate: false,
//     });

//     if (!inventoryDocs || inventoryDocs.length === 0) {
//       return [];
//     }

//     // Flatten the inventory documents to extract product info
//     const products = inventoryDocs.flatMap((inv) =>
//       inv.products
//         .filter((p) => p.productId) // Ensure product exists
//         .map((p) => ({
//           productId: p.productId._id,
//           name: p.productId.name,
//           description: p.productId.description,
//           // Use inventory price if available; otherwise, fallback to product price
//           price: p.price || p.productId.price,
//           stockIn: p.stockIn,
//           stockOut: p.stockOut,
//           currentStock: p.stockIn - p.stockOut,
//         }))
//     );

//     return products;
//   } catch (error) {
//     console.error("Error retrieving products:", error);
//     throw new Error("Failed to fetch products");
//   }
// };

// reading from main inventory 
module.exports.GetInventoryDatafinal = async () => {
  try {
    const inventoryDocs = await Inventory.find().populate({
      path: "products.productId",
      model: "Product",
      strictPopulate: false,
    });

    if (!inventoryDocs || inventoryDocs.length === 0) {
      console.log('data eq = : ' + data);
      return { message: "No inventory data found", data: [] };
    }

    // Instead of flattening or mapping to a custom object,
    // we return the products arrays as they exist in the inventory documents.
    // Option 1: Return as an array of arrays:
    // const productsData = inventoryDocs.map(inv => inv.products);

    // Option 2: Flatten them into a single array:
    const productsData = inventoryDocs.flatMap(inv => inv.products);

    return { message: "Products retrieved successfully", data: productsData };
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw new Error("Failed to fetch products");
  }
};



// reading from product schema 
// module.exports.GetInventoryData = async () => {
//   try {
//     // Populate products in inventory
//     const inventory = await Inventory.find().populate({
//       path: "products.productId",
//       select: "name price flavor createdAt", // Selecting specific fields from Product
//       strictPopulate: false,
//     });

//     // Map inventory data to return the required format
//     const inventoryData = inventory.flatMap((inv) =>
//       inv.products.map((p) => ({
//         _id: p.productId._id,
//         name: p.productId.name,
//         price: p.productId.price,
//         flavor: p.productId.flavor,
//         createdAt: p.productId.createdAt,
//         stockIn: p.stockIn, // From Inventory
//         stockOut: p.stockOut, // From Inventory
//       }))
//     );

//     return inventoryData;
//   } catch (error) {
//     console.error("Error fetching inventory data:", error);
//     throw error;
//   }
// };

module.exports.GetInventoryData = async () => {
  try {
    // Populate products and category name
    const inventory = await Inventory.find().populate({
      path: "products.productId",
      select:
        "name price flavor createdAt description images categoryid sellerId status",
      populate: {
        path: "categoryid", // Populating category data
        select: "name", // Selecting only category name
      },
      strictPopulate: false,
    });

    // Map inventory data to return the required format
    const inventoryData = inventory.flatMap((inv) =>
      inv.products.map((p) => ({
        _id: p.productId._id, // Product ID
        name: p.productId.name, // Product Name
        price: p.productId.price, // Product Price
        flavor: p.productId.flavor, // Product Flavor
        createdAt: p.productId.createdAt, // Created At
        description: p.productId.description, // Product Description
        images: p.productId.images, // Product Images
        categoryid: p.productId.categoryid?._id, // Category ID
        categoryName: p.productId.categoryid?.name, // Category Name (Newly Added)
        sellerId: p.productId.sellerId, // Seller ID
        status: p.productId.status, // Product Status
        stockIn: p.stockIn, // Inventory Stock In
        stockOut: p.stockOut, // Inventory Stock Out
      }))
    );

    return inventoryData;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    throw error;
  }
};



// module.exports.GetInventoryData = async()=>{
//     const inventory = await Inventory.find().populate({
//       path: "products.productId",
//       select: "name price flavor createdAt", // Selecting specific fields from Product
//       strictPopulate: false,
//     });

//     const populatedProducts = inventory
//       .map(
//         (inv) => inv.products.map((p) => p.productId) 
//       )
      
//        .flat(); // Flatten if needed

//     return populatedProducts;

// }

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

