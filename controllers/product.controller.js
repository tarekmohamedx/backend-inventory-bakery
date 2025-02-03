const express = require("express");
const productService = require("../services/product.service");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

const router = express.Router();

// Get all products
router.get("/allproducts", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product details
router.get("/products/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get top products
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await productService.getTopProducts();
    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get last added products
router.get("/last-products", async (req, res) => {
  try {
    const lastProducts = await productService.getLastProducts();
    if (!lastProducts) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(lastProducts);
  } catch (error) {
    console.error("Error fetching last products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get("/products", async (req, res) => {
  try {
    console.log("Query Params:", req.query);
    const category = req.query.category;
    const products = await productService.findByCategory(category);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post("/products", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Validate required fields
    const { name, description, price, stock, category, flavor, categoryid, discounted, sales, previousprice } = req.body;
    if (!categoryid || isNaN(parseFloat(price)) || isNaN(parseInt(stock, 10))) {
      return res.status(400).json({ error: "Missing or invalid required fields: categoryid, price, stock" });
    }

    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "At least one image file is required" });
    }

    const uploadedFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    
    // Upload images to ImageKit
    const uploadedImages = await Promise.all(
      uploadedFiles.map(async (file) => {
        const uploaded = await imagekit.upload({
          file: file.data,
          fileName: file.name,
          folder: "/products",
        });
        return uploaded.url;
      })
    );

    console.log("ImageKit Upload URLs:", uploadedImages);

    // Create new product
    const newProduct = await productService.createProduct({
      name,
      description,
      price: parseFloat(price),
      category,
      previousprice: previousprice ? parseFloat(previousprice) : undefined,
      sales: sales ? parseInt(sales, 10) : 0,
      stock: parseInt(stock, 10),
      flavor,
      discounted: discounted === "true",
      categoryid,
      images: uploadedImages,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: "This product does not exist" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "This product does not exist" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
