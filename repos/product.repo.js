const Product = require('../models/Product.model');

// get all products
module.exports.getProducts = async() => {
    try{
        const products = await Product.find({}).populate('categoryid', 'name').exec();
        return products;
    }catch (error) {
        console.error("get All products error: ", error);
        throw error;
    }
} 

// get products detail
module.exports.getProductById = async (ProductId) => {
    try {
      return await Product.findById(ProductId);
    } catch (error) {
      console.error("Error fetching products by ID: ", error);
      throw error;
    }
};

// get top products (best seller)

module.exports.getTopProducts = async()=>{
    try{
const topProducts = await Product.find({})
.sort({sales: -1})
 .limit(5);     
return topProducts;

    }catch(error){
console.log("Error fetching top products",error);
throw error
    }
};


// get last product added

module.exports.getLastProducts= async()=>{
    try{
const lastProducts = await Product.find({})
.sort({createdAt : -1}).limit(6).populate('categoryid', 'name', );
return lastProducts;
    }catch(error){
        console.log("Error fetching last product added",error)
    }
}

// get products by seller id
module.exports.getProductsBySeller  = async (sellerId) => {
    try {
        const products = await Product.find({ sellerId: sellerId }).populate('categoryid', 'name').populate('sellerId', 'profile').exec();;
        return products;
      } catch (error) {
        throw new Error("Failed to fetch products for the seller");
      }
};


  // create products
module.exports.createProduct = async (ProductData) => {
    try {
        const newProduct = new Product(ProductData);
        const savedProduct = await newProduct.save();
        return savedProduct;
    } catch (error) {
        console.error("Error creating products: ", error);
        throw error;
    }
};
  
  // update products
module.exports.updateProduct = async (ProductId, updatedData) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(ProductId, updatedData, {
        new: true,
        runValidators: true,
        });
        return updatedProduct;
    } catch (error) {
        console.error("Error updating products: ", error);
        throw error;
    }
};
  
  // delete a products
module.exports.deleteProduct = async (productId) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        return deletedProduct;
    } catch (error) {
        console.error("Error deleting products: ", error);
        throw error;
    }
};

  module.exports.findByCategory = async (category) => {
    try {
        return await Product.find({ category: category });
    } catch (error) {
        console.error("Error fetching products from DB:", error);
        throw error;
    }
};



