const express = require('express');
const router = express.Router();
const InventoryService = require('../services/inventory.service')


const getInventoryData = async (req, res)=>{
        try{
            const InventoryData = await InventoryService.GetInventoryData();
            res.status(200).json({
                InventoryData
            });
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
        res.status(200).json({
            branchStock
        })

        
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
        res.status(200).json({
            branches
        })
        
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



router.get('/all', getInventoryData);
router.get('/branch/:branchId', getBranchStock);
router.get('/branch/info/:branchId', getBranchInfo);
router.get('/branches', getAllBranches);

router.post('/clerk/request/:branchId', requestStock);
router.get('/requests', getAllRequests);




module.exports = router;