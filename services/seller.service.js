const sellerRepo =require("../repos/seller.repo");

//get all sellers
module.exports.getSellers = async()=>{
     return await sellerRepo.getsellers()
}
// get seller by id
module.exports.getSellerById = async(sellerID)=>{
    return await sellerRepo.getSellerById(sellerID)
}
// crate seller
module.exports.createSeller = async(sellerData)=>{
    return await sellerRepo.createSeller(sellerData)
}

// update seller
module.exports.updateSeller = async(sellerId,sellerData)=>{
    return await sellerRepo.updateSeller(sellerId,sellerData)
}

// delete seller
module.exports.deleteSeller = async(sellerID)=>{
    return await sellerRepo.deleteSeller(sellerID)
}