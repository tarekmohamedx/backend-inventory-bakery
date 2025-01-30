const Product = require('../models/Product.model');

// get all products
module.exports.getProducts = async() => {
    try{
        const products = await Product.find({});
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