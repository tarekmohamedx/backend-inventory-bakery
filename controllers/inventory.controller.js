const express = require('express');
const router = express.Router();
const InventoryService = require('../services/inventory.service')


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




router.get('/all', getInventoryData);
router.get('/branch/:branchId', getBranchStock);
router.get('/branch/info/:branchId', getBranchInfo);
router.get('/branches', getAllBranches);

router.post('/clerk/request/:branchId', requestStock);
router.get('/requests', getAllRequests);
router.put('/stockReq/:requestId', changeRequestStat);
router.post('/transfer/:requestId', transferToBranch);




module.exports = router;