
const Seller =require( '../models/users.model');
const Order = require('../models/orders.model')

//get all sellers
 const getsellers = async()=>{
    try{
  const sellers = await Seller.find({});
console.log("Sellers from DB:", sellers);  // Debugging log
return sellers;
    }catch(error){
        console.error('Error fetching sellers:', error);
        throw error;
    }
}

// get seller by id

 const getSellerById =async(sellerID)=>{
try{
return await Seller.findById(sellerID)

}catch(error){
    console.error('Error fetching seller by ID:', error);
    throw error;
}

}

// create a new seller
 const createSeller =async(sellerData)=>{
    try{
        const newSeller = new Seller(sellerData);
        return await newSeller.save();

    }catch(error){
        console.log("Error in creating seller",error);
        throw Error
    }
}

//update seller
 const updateSeller = async (sellerID,updateData)=>{
try{
return await Seller.findByIdAndUpdate(sellerID,updateData,{new:true,runValidators: true})

}catch(error){
    console.log("Error in updating seller",error);
        throw Error
}

}

// delete seller
const deleteSeller = async(sellerID)=>{
    try{
return await Seller.findByIdAndDelete(sellerID);
    }catch(error){
        console.log("Error in deleting seller",error);
        throw Error
    }
}



/*
const getSellerStats = async (sellerID) => {
    try {
        const seller = await Seller.findById(sellerID);
        console.log("Seller Found:", seller)
        if (!seller) {
            throw new Error("Seller not found");
        }
        console.log("Seller data:", seller);
        return {
            storeName: seller.storeName ,
            totalSales: seller.totalSales ||0,
            totalProfits: seller.totalProfits ||0,
        };
    } catch (error) {
        console.error("Error fetching seller stats:", error);
        throw error;
    }
};*/



async function getSellerStats(sellerId) {
    console.log("Fetching stats for sellerId:", sellerId); 

    // ✅ Check if seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
        throw new Error(`Seller with ID ${sellerId} not found in database.`);
    }

    // ✅ Fetch total sales and profits
    const orders = await Order.find({ sellerId });
    let totalSales = 0;
    let totalProfits = 0;

    orders.forEach(order => {
        totalSales += order.totalAmount; 
        totalProfits += order.profit;    
    });

    const pendingOrders = await Order.countDocuments({ sellerId, status: "pending" });
    const latestOrders = await Order.find({ sellerId }).sort({ createdAt: -1 }).limit(5);
    const customers = await Order.distinct("customerId", { sellerId }).length;
    
    // Example: Aggregate top-selling products
    const topProducts = await Order.aggregate([
        { $match: { sellerId } },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", sales: { $sum: "$items.quantity" } } },
        { $sort: { sales: -1 } },
        { $limit: 5 }
    ]);

    
    return { totalSales, totalProfits, pendingOrders, latestOrders, customers, topProducts  };
}



async function getTotalSales(sellerId) {
    const result = await Seller.aggregate([
        { $match: { _id: sellerId } },
        { $group: { _id: null, total: { $sum: "$totalSales" } } }
    ]);
    return result.length ? result[0].total : 0;
}

async function getLatestOrders(sellerId) {
    return await Seller.findById(sellerId).select("latestOrders").limit(5);
}

async function getCustomerCount(sellerId) {
    return await Seller.countDocuments({ sellerId });
}

async function getTopSellingProducts(sellerId) {
    const seller = await Seller.findById(sellerId).select("topProducts");
    return seller ? seller.topProducts : [];
}



module.exports = {
    getsellers,
    getSellerById,
    createSeller,
    updateSeller,
    getSellerStats,
  deleteSeller,
  getTotalSales, 
  getLatestOrders,
   getCustomerCount,
    getTopSellingProducts
 };

  
  
