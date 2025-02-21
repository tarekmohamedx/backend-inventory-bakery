const productService = require("../services/product.service");
const { getLastProducts } = require("../repos/product.repo");
const Product = require("../models/Product.model");
const express = require("express");
const ImageKit = require("imagekit");
const verifyToken = require("../middlewere/authentication.middlewere");

const router = express.Router();
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

module.exports = (() => {
  const router = require("express").Router();

  // router.use(fileUpload());

  // get products
  router.get("/allproducts", async (req, res, next) => {
    try {
      const products = await productService.getProducts();
      console.log(products);
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

  // get top products (best seller products)
  router.get("/top-products", async (req, res, next) => {
    try {
      const top_products = await productService.getTopProducts();
      res.status(200).json(top_products);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // get the last products added
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
  router.post("/products", verifyToken ,async (req, res) => {
    try {
      const user = req.user;
      console.log("req,user", user);
      if (user.role !== 'Seller' && user.role !== 'Admin') {
        return res.status(403).json({ message: 'You do not have permission to add a product' });
      }
      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files);

      // Convert values to correct types
      const parsedPrice = parseFloat(req.body.price);
      const parsedStock = parseInt(req.body.stock, 10);
      const parsedPreviousPrice = req.body.previousprice
        ? parseFloat(req.body.previousprice)
        : undefined;
      const parsedSales = req.body.sales ? parseInt(req.body.sales, 10) : 0;
      const parsedDiscounted = req.body.discounted === "true"; // Convert "true" string to boolean
      if (isNaN(parsedPrice) || isNaN(parsedStock)) {
        return res.status(400).json({
          error: "Missing or invalid required fields: `price`, `stock`",
        });
      }

      // Check if images are provided
      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ error: "At least one image file is required" });
      }

      // Ensure `req.files.images` is an array
      const uploadedFiles = req.files?.images
        ? Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images]
        : [];

      // Upload images to ImageKit
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
            console.error("Error uploading image:", uploadError);
            throw new Error("Image upload failed");
          }
        })
      );

      console.log("ImageKit Upload URLs:", uploadedImages);

    // Create a new product
    const newProduct = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: parsedPrice,
      previousprice: parsedPreviousPrice,
      sales: parsedSales,
      stock: parsedStock,
      flavor: req.body.flavor,
      discounted: parsedDiscounted,
      images: uploadedImages,
      categoryid: req.body.categoryid,
      sellerId: user.userId,
      accentColor: req.body.accentColor || '#0B374D',
      status: req.body.status || 'Pending',
      branch:req.body.branch
    });

      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error processing product creation:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }
  });

  // update products
  router.put("/products/:id", async (req, res, next) => {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        return res
          .status(404)
          .json({ error: "This product does not exist :(" });
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
        return res
          .status(404)
          .json({ error: "This Product does not exist :(" });
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

  // Route to get products by sellerId
router.get("/products/seller/:sellerId", async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await productService.getProductsBySeller(sellerId);
    
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found for this seller" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products for seller:", error);
    res.status(500).json({ error: error.message });
  }
});

/// Update the endpoint to handle capacity check with product quantity
// Backend - Route to check branch capacity

router.post('/check-branch-capacity', async (req, res) => {
  const { branch, quantity } = req.body;

  try {
    // Find the branch by name to get the ObjectId
    const branchData = await Branch.findOne({ name: branch });

    if (!branchData) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    // Now find the branch inventory using the branchId
    const branchInventory = await BranchInventory.findOne({ branchId: branchData._id });
    // console.log(branchInventory.name);
    console.log('Branch data:', branchData);  // Logs branch info
    console.log('Branch Inventory:', branchInventory);  // Logs branch inventory info


    if (!branchInventory) {
      return res.status(404).json({ success: false, message: 'Branch inventory not found' });
    }

    // Calculate remaining capacity
    const remainingCapacity = branchInventory.capacity - branchInventory.currentStock;

    if (remainingCapacity >= quantity) {
      return res.status(200).json({
        success: true,
        availableCapacity: remainingCapacity,
        exceedsCapacity: false
      });
    }else {
      return res.status(200).json({
        success: false,
        availableCapacity: remainingCapacity,
        exceedsCapacity: true
      });
    }
  } catch (error) {
    console.error('Error checking branch capacity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// In your branch-inventory routes file
router.get('/branch-inventory', verifyToken, async (req, res) => {
  try {
    const sellerId = req.query.sellerId;
    // Find all branch inventory items and populate branch and product details
    const inventory = await BranchInventory.find()
      .populate('branchId', 'name')
      .populate('productId', 'name sellerId price currentStock capacity')
      .exec();
    
    // Filter items where the product's sellerId matches the sellerId provided
    const sellerInventory = inventory.filter(item => 
      item.productId && item.productId.sellerId && item.productId.sellerId.toString() === sellerId
    );
    
    res.status(200).json(sellerInventory);
  } catch (error) {
    console.error("Error fetching branch inventory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// totalProducts card in seller dashboard
router.get('/seller/totalProducts/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const totalProducts = await Product.countDocuments({ sellerId });
    return res.status(200).json({ success: true, totalProducts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

// pendingProducts card in seller dashboard
router.get('/seller/pendingProducts/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const pendingProducts = await Product.countDocuments({ sellerId, status: 'Pending' });
    return res.status(200).json({ success: true, pendingProducts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});


  return router;
})();

