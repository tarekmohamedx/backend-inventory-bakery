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
// get sellers stats
module.exports.getSellerStats = async (sellerId) => {
    return await sellerRepo.getSellerStats(sellerId);
  };

 

async function getSellerDashboardStats(sellerId) {
    const seller = await sellerRepo.getSellerById(sellerId);
    if (!seller) return null;

    // Calculate total money, customer count, and get top products
    const totalMoney = await sellerRepo.getTotalSales(sellerId);
    const latestOrders = await sellerRepo.getLatestOrders(sellerId);
    const customers = await sellerRepo.getCustomerCount(sellerId);
    const topProducts = await sellerRepo.getTopSellingProducts(sellerId);

    return {
        totalSales: totalMoney,
        latestOrders,
        customers,
        topProducts,
    };
}

module.exports = { getSellerDashboardStats };
