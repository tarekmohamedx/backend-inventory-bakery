const Inventory = require('../models/inventory.model');


module.exports.GetInventoryData = async()=>{
     try{
let inventories = await Inventory.find().populate("products.productId");

let productsArray = inventories.flatMap(
  (inventory) => inventory.products.map((p) => p.productId) 
);

return productsArray;
     }catch(error)
     {
          throw new Error ( 'error = ' + error.message);
     }
}







