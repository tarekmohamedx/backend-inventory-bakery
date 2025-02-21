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



router.get('/all', getInventoryData);
router.get('/branch/:branchId', getBranchStock);
router.get('/branch/info/:branchId', getBranchInfo);
router.get('/branches', getAllBranches);





module.exports = router;