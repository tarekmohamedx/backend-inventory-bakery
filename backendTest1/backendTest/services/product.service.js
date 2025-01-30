const productRepo = require('../repos/product.repo');

module.exports.getProducts = async () => {
    return await productRepo.getProducts();
};

module.exports.getProductById = async (productId) => {
    return await productRepo.getProductById(productId);
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