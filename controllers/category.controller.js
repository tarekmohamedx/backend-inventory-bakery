const  categoryService  = require('../services/category.service');

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
        router.post("/category", async(req, res, next) => {
            try{
            const new_category = await categoryService.createCategory(req.body);
            res.status(201).json(new_category);
            }catch(error){
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