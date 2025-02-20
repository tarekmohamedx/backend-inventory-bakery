const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const productService = require("../services/product.service");
const { getLastProducts } = require("../repos/product.repo");
const ImageKit = require("imagekit");
const verifyToken = require("../middlewere/authentication.middlewere");

const router = express.Router();

// ✅ Initialize ImageKit properly
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

// 🟢 Get all products
router.get("/allproducts", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Get product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Get top products
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await productService.getTopProducts();
    res.status(200).json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Get the last added products
router.get("/last-products", async (req, res) => {
  try {
    const lastProducts = await getLastProducts();
    if (!lastProducts || lastProducts.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(lastProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Get products by category
router.get("/products", async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    const products = await productService.findByCategory(category);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Create a new product
router.post("/products", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Convert values to the correct types
    const parsedPrice = parseFloat(req.body.price);
    const parsedStock = parseInt(req.body.stock, 10);
    const parsedPreviousPrice = req.body.previousprice
      ? parseFloat(req.body.previousprice)
      : undefined;
    const parsedSales = req.body.sales ? parseInt(req.body.sales, 10) : 0;
    const parsedDiscounted = req.body.discounted === "true";

    // Validate required fields
    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res
        .status(400)
        .json({ error: "Invalid required fields: `price`, `stock`" });
    }

    if (!req.files || !req.files.images) {
      return res
        .status(400)
        .json({ error: "At least one image file is required" });
    }

    // Handle image upload
    const uploadedFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    const uploadedImages = await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          const uploaded = await imagekit.upload({
            file: file.data,
            fileName: file.name,
            folder: "/products",
          });
          return uploaded.url;
        } catch (uploadError) {
          throw new Error("Image upload failed");
        }
      })
    );

    // Create new product
    const newProduct = await productService.createProduct({
      name: req.body.name,
      description: req.body.description,
      price: parsedPrice,
      previousprice: parsedPreviousPrice,
      sales: parsedSales,
      stock: parsedStock,
      flavor: req.body.flavor,
      discounted: parsedDiscounted,
      category: req.body.category,
      images: uploadedImages,
      status: "Pending",
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// 🟢 Update product by ID
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
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Delete product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "This product does not exist :(" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
