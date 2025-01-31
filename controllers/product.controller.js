const { getLastProducts } = require('../repos/product.repo');
const productService = require('../services/product.service');


module.exports = (() => {
  const router = require("express").Router();

  // get products
  router.get("/allproducts", async (req, res, next) => {
    try {
      const products = await productService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // get products detail
  router.get("/products/:id", async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching products details:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // get top products (best seller products)
  router.get("/top-products", async (req, res, next) => {
    try {
      const top_products = await productService.getTopProducts();
      res.status(200).json(top_products)
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ error: error.message })
    }
  })

  // get the last products added
  
  router.get("/last-products", async (req, res) => {
    try {
      const last_product = await productService.getLastProducts();
      if (!last_product) {
        return res.status(404).json({ error: "No products found" });
      }
      res.status(200).json(last_product)
    } catch (error) {
      console.log("Error fetching last products", error)
      res.status(500).json({ error: error.message })
    }

  })



  // create products
  router.post("/products", async (req, res, next) => {
    try {
      const new_product = await productService.createProduct(req.body);
      res.status(201).json(new_product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // update products
  router.put("/products/:id", async (req, res, next) => {
    try {
      const updatedProduct = await productService.updateProduct(req.params.id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ error: "This product does not exist :(" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // delete products
  router.delete("/products/:id", async (req, res) => {
    try {
      const deletedProduct = await productService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "This Product does not exist :(" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get products by category
  router.get('/products', async (req, res) => {
    try {
      console.log("Query Params:", req.query);
      const category = req.query.category;
      const products = await productService.findByCategory(category);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
})();