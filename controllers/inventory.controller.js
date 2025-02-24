const express = require('express');
const router = express.Router();
const InventoryService = require('../services/inventory.service');
const { BranchInventory } = require("../models/branchinventory.model");
const Product = require('../models/Product.model');


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

    // Find product in main stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock <= 0)
      return res.status(400).json({ message: "Stock is empty" });

    // 10% transfer, but at least 1 unit
    const transferQuantity = Math.max(Math.floor(product.stock * 0.1), 1);

    if (product.stock < transferQuantity){
        
    }
      return res.status(400).json({ message: "Not enough stock for transfer" });

    // Find branch inventory for the specific product
    let branchInventory = await BranchInventory.findOne({
      branchId,
      productId,
    });

    if (!branchInventory) {
      // If branch inventory does not exist, create a new entry for the product
      branchInventory = new BranchInventory({
        branchId,
        productId,
        stockIn: transferQuantity,
        stockOut: 0,
        currentStock: transferQuantity,
        price: product.price, // Assuming price should be carried over
      });
    } else {
      // Check if adding stock exceeds capacity
      if (
        branchInventory.capacity &&
        branchInventory.currentStock + transferQuantity >
          branchInventory.capacity
      ) {
        return res
          .status(400)
          .json({ message: "Not enough space in branch inventory" });
      }

      // If product exists in inventory, increase quantity
      branchInventory.stockIn += transferQuantity;
      branchInventory.currentStock += transferQuantity;
    }

    product.stock -= transferQuantity; // Reduce main stock

    await branchInventory.save();
    await product.save();

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



router.get('/all', getInventoryData);
router.get('/branch/:branchId', getBranchStock);
router.get('/branch/info/:branchId', getBranchInfo);
router.get('/branches', getAllBranches);

router.get('/cashier/:cashierId', getProductsByCashier);
router.post('/clerk/request/:branchId', requestStock);
router.get('/requests', getAllRequests);
router.put('/stockReq/:requestId', changeRequestStat);
router.post('/transfer/:requestId', transferToBranch);
router.post('/transferfromadmintobranch', transferfromadmintobranch);



module.exports = router;