const express = require('express');
const router = express.Router();
const InventoryService = require('../services/inventory.service')


const getInventoryData = async (req, res)=>{
        try{
            const InventoryData = await InventoryService.GetInventoryData();
            console.log(InventoryData); 
            console.log(await InventoryService.GetInventoryData());
            res.status(200).json(
                InventoryData
            );
        }catch(err){
                res.status(400).json({
                    error: err.message
                })
        }
}








router.get('/all', getInventoryData);



module.exports = router;