const express = require("express");
const mongoose = require("mongoose");
const productService = require("../services/product.service");
const { getLastProducts } = require("../repos/product.repo");
const Product = require("../models/Product.model");
const ImageKit = require("imagekit");

const router = express.Router();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

// Get all products
router.get("/allproducts", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product details by ID
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

// Get top products (best seller products)
router.get("/top-products", async (req, res) => {
  try {
    const top_products = await productService.getTopProducts();
    res.status(200).json(top_products);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get the last products added
router.get("/last-products", async (req, res) => {
  try {
    const last_product = await productService.getLastProducts();
    if (!last_product) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(last_product);
  } catch (error) {
    console.log("Error fetching last products", error);
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post("/products", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Convert values to correct types
    const parsedPrice = parseFloat(req.body.price);
    const parsedStock = parseInt(req.body.stock, 10);
    const parsedPreviousPrice = req.body.previousprice
      ? parseFloat(req.body.previousprice)
      : undefined;
    const parsedSales = req.body.sales ? parseInt(req.body.sales, 10) : 0;
    const parsedDiscounted = req.body.discounted === "true";
    const parsedCategoryId = req.body.categoryid;

    if (!parsedCategoryId || isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({
        error:
          "Missing or invalid required fields: `categoryid`, `price`, `stock`",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one image file is required" });
    }

    const uploadedFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

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

    const newProduct = await productService.createProduct({
      name: req.body.name,
      description: req.body.description,
      price: parsedPrice,
      category: req.body.category,
      previousprice: parsedPreviousPrice,
      sales: parsedSales,
      stock: parsedStock,
      flavor: req.body.flavor,
      discounted: parsedDiscounted,
      categoryid: parsedCategoryId,
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
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "This product does not exist :(" });
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
      return res.status(404).json({ error: "This Product does not exist :(" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
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

module.exports = router;
