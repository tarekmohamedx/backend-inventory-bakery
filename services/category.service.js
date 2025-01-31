const categoryRepo = require('../repos/category.repo');

module.exports.getCategories = async () => {
    return await categoryRepo.getCategories();
};

module.exports.getCategoryByName = async (categoryName) => {
    return await categoryRepo.getCategoryByName(categoryName);
};

module.exports.createCategory = async (CategoryData) => {
    return await categoryRepo.createCategory(CategoryData);
};

module.exports.updateCategory = async(CategoryId, updatedData) => {
    return await categoryRepo.updateCategory(CategoryId, updatedData);
};

module.exports.deleteCategory = async (CategoryId) => {
    return await categoryRepo.deleteCategory(CategoryId);
};
  