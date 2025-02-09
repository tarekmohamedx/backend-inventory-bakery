
const Seller =require( '../models/seller.model').default;
console.log(Seller);

//get all sellers
 const getsellers = async()=>{
    try{
return await Seller.find({})

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

module.exports = {
    getsellers,
    getSellerById,
    createSeller,
    updateSeller,
    deleteSeller
};