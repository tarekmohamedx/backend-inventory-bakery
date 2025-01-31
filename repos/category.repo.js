const Category = require('../models/category.model');

// get all categories
module.exports.getCategories = async() => {
    try{
        const categories = await Category.find({});
        return categories;
    }catch (error) {
        console.error("get All categories error: ", error);
        throw error;
    }
} 

// Get category by name
module.exports.getCategoryByName = async (categoryName) => {
    try {
        return await Category.findOne({ name: categoryName }); // Search by 'name' field
    } catch (error) {
        console.error("Error fetching category by name: ", error);
        throw error;
    }
};


  // create category
module.exports.createCategory = async (CategoryData) => {
    try {
        const newCategory = new Category(CategoryData);
        const savedCategory = await newCategory.save();
        return savedCategory;
    } catch (error) {
        console.error("Error creating categories: ", error);
        throw error;
    }
};
  

  // update categories
module.exports.updateCategory = async (CategoryId, updatedData) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(CategoryId, updatedData, {
        new: true,
        runValidators: true,
        });
        return updatedCategory;
    } catch (error) {
        console.error("Error updating categories: ", error);
        throw error;
    }
};


  // delete a categories
module.exports.deleteCategory = async (CategoryId) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(CategoryId);
        return deletedCategory;
    } catch (error) {
        console.error("Error deleting categories: ", error);
        throw error;
    }
};
  