const  categoryService  = require('../services/category.service');
const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

module.exports = (() => {
    const router = require("express").Router();
  
        // get categories
        router.get("/category", async (req, res, next) => {
          try{
            const categories = await categoryService.getCategories();
            res.status(200).json(categories);
          }catch(error){
            res.status(500).json({ error: error.message });
          }
        });
      
        // Get category by name
        router.get("/category/:name", async (req, res) => {
            try {
                const categoryName = req.params.name;
                const category = await categoryService.getCategoryByName(categoryName); 
        
                if (!category) {
                    return res.status(404).json({ error: "Category not found" });
                }
        
                res.status(200).json(category);
            } catch (error) {
                console.error("Error fetching category details:", error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // create categories
        router.post("/category", async (req, res) => {
            try {
              console.log("Uploaded Files:", req.files); // Debug uploaded files
          
              if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ error: "At least one image file is required" });
              }
          
              // Ensure `req.files.images` is an array
              const uploadedFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
          
              // Upload images to ImageKit
              const uploadedImages = await Promise.all(
                uploadedFiles.map(async (file) => {
                  const uploaded = await imagekit.upload({
                    file: file.data, // Use `data` instead of `buffer`
                    fileName: file.name, // Use `name` instead of `originalname`
                    folder: "/categories",
                  });
                  return uploaded.url;
                })
              );
          
              console.log("ImageKit Upload URLs:", uploadedImages); // Debug ImageKit response
          
              // Create new category with uploaded images
              const newCategory = await categoryService.createCategory({
                name: req.body.name,
                description: req.body.description,
                images: uploadedImages,
              });
          
              res.status(201).json(newCategory);
            } catch (error) {
              console.error("Error uploading images:", error);
              res.status(500).json({ error: error.message });
            }
          });
          

        // update categories
        router.put("/category/:id", async(req, res, next) => {
          try {
            const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
            if (!updatedCategory) {
              return res.status(404).json({ error: "This category does not exist :(" });
            }
            res.status(200).json(updatedCategory);
          } catch (error) {
            console.error("Error updating category:", error);
            res.status(500).json({ error: error.message });
          }
        });

        // delete categories
        router.delete("/category/:id", async (req, res) => {
            try {
            const deletedCategory = await categoryService.deleteCategory(req.params.id);
            if (!deletedCategory) {
                return res.status(404).json({ error: "This category does not exist :(" });
            }
            res.status(200).json({ message: "category deleted successfully" });
            } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ error: error.message });
            }
        });
  
    return router;
})();