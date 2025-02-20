const productRepo = require('../repos/product.repo');

module.exports.getProducts = async () => {
    return await productRepo.getProducts();
};

module.exports.getProductById = async (productId) => {
    return await productRepo.getProductById(productId);
};

module.exports.getProductsBySeller = async (sellerId) => {
    return await productRepo.getProductsBySeller(sellerId);
};

module.exports.createProduct = async (ProductData) => {
    return await productRepo.createProduct(ProductData);
};

module.exports.updateProduct = async(productId, updatedData) => {
    return await productRepo.updateProduct(productId, updatedData);
};
  
module.exports.deleteProduct = async (productId) => {
    return await productRepo.deleteProduct(productId);
};

module.exports.findByCategory = async (category) => {
    if (!category) {
        throw new Error("Category parameter is required");
    }
    const products = await productRepo.findByCategory(category);
    if (!products.length) {
        throw new Error("No products found for this category.");
    }
    return products;
};

// call getTopProduct
module.exports.getTopProducts= async()=>{
    return await productRepo.getTopProducts();
}

// get last product
module.exports.getLastProducts = async ()=>{
    return await productRepo.getLastProducts();
}