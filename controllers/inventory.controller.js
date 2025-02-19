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








router.get('/', getInventoryData);



module.exports = router;