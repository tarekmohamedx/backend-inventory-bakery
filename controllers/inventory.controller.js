const express = require('express');
const router = express.Router();
const InventoryService = require('../services/inventory.service');
const { BranchInventory, Branch } = require("../models/branchinventory.model");
const Product = require('../models/Product.model');
const OrderOffline = require('../models/OrderOffline.model');
const Inventory = require('../models/inventory.model')


// GET /inventory?category=<categoryName>
router.get("/inventory", async (req, res) => {
    try {
      const categoryName = req.query.category;
      if (!categoryName) {
        return res.status(400).json({ error: "Category query parameter is required" });
      }
  
      // Find all inventories and populate products.productId and productId.categoryid
      let inventories = await Inventory.find({})
        .populate({
          path: "products.productId",
          populate: { 
            path: "categoryid", 
            select: "name" 
          }
        })
        .lean();
  
      // For each inventory document, filter products by category name
      const filteredInventories = inventories
        .map(inv => {
          const filteredProducts = inv.products.filter(prod => {
            // Ensure product and its category exist
            return prod.productId &&
              prod.productId.categoryid &&
              prod.productId.categoryid.name &&
              prod.productId.categoryid.name.toLowerCase() === categoryName.toLowerCase();
          });
          return { ...inv, products: filteredProducts };
        })
        // Only return inventories with at least one matching product
        .filter(inv => inv.products.length > 0);

        console.log("filteredInventories: ", filteredInventories)
  
      return res.status(200).json(filteredInventories);
    } catch (error) {
      console.error("Error fetching inventory by category:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  



const getInventoryData = async (req, res)=>{
    try{
        const InventoryData = await InventoryService.GetInventoryData();
        res.status(200).json(
            InventoryData
        );
    }catch(err){
      res.status(400).json({
          err
      })
    }
}

const getInventoryDatafinal = async (req, res)=>{
    try{
        const InventoryData = await InventoryService.GetInventoryDatafinal();
        res.status(200).json(
            InventoryData
        );
    }catch(err){
      res.status(400).json({
          err
      })
    }}


const getBranchStock = async (req, res)=>{
    try {
         const {branchId} = req.params
         const branchStock = await InventoryService.getBranchStock(branchId);
        res.status(200).json(
            branchStock
        )

        
    } catch (error) {
        res.status(400).json({
            error
        })
    }

}


const getBranchInfo = async (req, res)=>{
    try {
        const {branchId} = req.params;
        const branchInfo = await InventoryService.getBranchInfo(branchId);
        res.status(200).json({
            branchInfo
        })
        
    } catch (error) {
        res.status(400).json({
            error
        })   
    }
}
const getAllBranches = async (req, res)=>{
    try {
        const branches = await InventoryService.getAllBranches();
        res.status(200).json(
            branches
        )
        
    } catch (error) {
        res.status(400).json({
            error
        })   
    }
}
const requestStock = async (req, res)=>{
    try {
        const {branchId} = req.params;
        const {productId, quantity} = req.body;
        await InventoryService.requestStock(branchId, productId, quantity);
        res.status(200).json({
            success: true,
            message: "Stock Request has been sent to Main Inventory"
        })
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })   
    }
}
const getAllRequests = async (req, res)=>{
    try {
        const stockRequests = await InventoryService.getAllRequests();
        res.status(200).json({
            stockRequests
        })
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })   
    }
}

const changeRequestStat = async(req, res)=>{
    try {
        const requestId = req.params.requestId;
        const { status, message } = req.body;
        console.log(requestId);
        
        if (!status || !requestId) {
        return res.status(400).json({ message: "Status or Request Id is required" });
         }   

        const reqUpdated = await InventoryService.changeRequestStat(requestId, status, message);
        if (!reqUpdated) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        res.status(200).json({
            success: true,
            message: "Stock Request Status has been changed",
            data: reqUpdated
        })
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })   
    }
}


const transferToBranch = async(req, res)=>{
    try {
        const requestId = req.params.requestId;
        const response =  await InventoryService.transferToBranch(requestId);
        res.status(200).json({
            success: true,
            message: response,
        })
        
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })   
    }
}

// transfer product to any branches we have it on system 

const transferfromadmintobranch = async (req, res) => {
  try {
    const { productId, branchId } = req.body;

    // Find inventory entry for the product
    const inventory = await Inventory.findOne({
      "products.productId": productId,
    });

    if (!inventory)
      return res
        .status(404)
        .json({ message: "Product not found in inventory" });

    // Find the specific product in the inventory
    const productEntry = inventory.products.find(
      (p) => p.productId.toString() === productId
    );

    if (!productEntry)
      return res
        .status(404)
        .json({ message: "Product entry not found in inventory" });

    if (productEntry.stockIn <= 0) {
      return res
        .status(400)
        .json({ message: "Stock is empty in main inventory" });
    }

    // Transfer 10% but at least 1 unit
    const transferQuantity = Math.max(
      Math.floor(productEntry.stockIn * 0.5),
      1
    );

    if (productEntry.stockIn < transferQuantity) {
      return res.status(400).json({ message: "Not enough stock for transfer" });
    }

    // Find or create branch inventory for this product
    let branchInventory = await BranchInventory.findOne({
      branchId,
      productId,
    });

    if (!branchInventory) {
      branchInventory = new BranchInventory({
        branchId,
        productId,
        stockIn: transferQuantity,
        stockOut: 0,
        currentStock: transferQuantity,
        price: productEntry.price, // Carry price from inventory
      });
    } else {
      if (
        branchInventory.capacity &&
        branchInventory.currentStock + transferQuantity >
          branchInventory.capacity
      ) {
        return res
          .status(400)
          .json({ message: "Not enough space in branch inventory" });
      }

      branchInventory.stockIn += transferQuantity;
      branchInventory.currentStock += transferQuantity;
    }

    // Decrease stockIn in the main inventory (instead of product stock)
    productEntry.stockIn -= transferQuantity;

    await branchInventory.save();
    await inventory.save(); // Save inventory changes

    res.json({
      message: `Transferred ${transferQuantity} units of product ${productId} to branch ${branchId}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// get all products by cashier id 
const getProductsByCashier = async (cashierId) => {
  try {
    const products = await BranchInventory.find({ cashier: cashierId })
      .populate("productId", "name price") 
      .select("productId stockIn stockOut price"); 

    if (!products.length) {
      return { message: "No products found for this cashier." };
    }

    return products;
  } catch (err) {
    throw new Error(err.message);
  }
};

// getBranchByCashierId = async(cashierId)=>{
//     return await Branch.findOne({ cashiers: cashierId }, { _id: 1 });
// }
// Z



const getOrdersByBranch = async(req, res)=>{
    try {
        const cashierId = req.params.cashierId;
        const orders = await OrderOffline.find({cashier:cashierId});
         return res.status(200).json({
            orders
             })
        
    } catch (error) {
        res.status(200).json({
           message: error.message
        })
    }

    
}

getRequestsForBranch = async(req,res)=>{
    try {
        const branchId = req.params.branchId;
        const requests = await InventoryService.getRequestsForBranch(branchId);
        res.status(200)
            .json({
                requests
            })
        
    } catch (error) {
        res.status(200).json({
                    message: error.message
            })
    }

}

router.get('/all', getInventoryData);
router.get('/allfinal', getInventoryDatafinal);
router.get('/branch/:branchId', getBranchStock);
router.get('/branch/info/:branchId', getBranchInfo);
router.get('/branches', getAllBranches);

router.get('/cashier/:cashierId', getProductsByCashier);
router.post('/clerk/request/:branchId', requestStock);
router.get('/requests', getAllRequests);
router.put('/stockReq/:requestId', changeRequestStat);
router.post('/transfer/:requestId', transferToBranch);
router.post('/transferfromadmintobranch', transferfromadmintobranch);
//router.post('/transferfromadmintobranch', transferfromadmintobranch);
router.get('/branch/orders/:cashierId', getOrdersByBranch);
router.get('/branch/requests/:branchId', getRequestsForBranch);

// /inventory/branch/requests/

module.exports = router;