const productService = require("../services/product.service");
const Product = require("../models/Product.model");
const userRepo = require('../repos/users.repo');
const express = require("express");
const httpStatusText = require("../utils/httpStatusText");
const Inventory = require('../models/inventory.model');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ImageKit = require("imagekit");
const Branch = require('../models/branchinventory.model').Branch;
const BranchInventory = require('../models/branchinventory.model').BranchInventory;
const OrderOffline = require('../models/OrderOffline.model');
const verifyToken = require("../middlewere/authentication.middlewere");
const InventoryService = require('../services/inventory.service');

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

///create
router.post("/products", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    console.log("req,user", user);
    if (user.role !== "Seller" && user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to add a product" });
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
    const parsedDiscounted = req.body.discounted === "true";

    // Validate required fields (categoryid removed)
    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({
        error: "Missing or invalid required fields: price, stock",
      });
    }

    // Check if images are provided
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one image file is required" });
    }

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
      accentColor: req.body.accentColor || "#0B374D",
      status: req.body.status || "Pending",
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
      const filteredProducts = products.filter(p =>p.status === 'Approved');
      console.log("filteredProducts: ", filteredProducts);
      res.status(200).json(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // get products by sellerId
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

//  Change product status by ID to admin 
router.patch("/product/changeproductstatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {

    const product = await productService.getProductById(id);


    if(product.status === "Approved"){
    return res.status(400).json({error: "Product already approved"}); 
    }
    
   
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }


    //Transfer to Main Inventory ??
    if(status === 'Approved')
      await InventoryService.transferToMainInventory(id);



    res.status(200).json(updatedProduct);
  } catch (error) {
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

    const inventory = await BranchInventory.find({})
      .populate('branchId', 'name')
      .populate('productId', 'name sellerId price currentStock capacity')
      .exec();
    const sellerInventory = inventory.filter(item => 
      item.productId && 
      item.productId.sellerId && 
      item.productId.sellerId.toString() === sellerId &&
      item.branchId != null
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

//---------------------------------------------------------------------------------------------------------------

router.get('/cashier/:cashierId/products', async (req, res) => {
  try {
    const cashierId = req.params.cashierId;
    const category = req.query.category; // e.g. "cookies"

    // 1. Find the branch where the cashier works.
    const branch = await Branch.findOne({ cashiers: cashierId });
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found for this cashier.' });
    }

    // 2. Find the inventory for that branch and populate product details,
    // including the category info from the 'categoryid' field.
    let inventoryItems = await BranchInventory.find({ branchId: branch._id })
      .populate({
        path: 'productId',
        populate: { path: 'categoryid', select: 'name' }
      });

    console.log("Raw Inventory Items:", inventoryItems);

    // Log each product's category for debugging.
    inventoryItems.forEach(item => {
      const prodName = item.productId ? item.productId.name : "No product";
      const catName = item.productId && item.productId.categoryid 
                      ? item.productId.categoryid.name 
                      : "Not populated";
      console.log(`Product: ${prodName}, Category: ${catName}`);
    });

    // 3. If a category is provided, filter inventory items based on the populated category name.
    if (category) {
      console.log("Filtering by category:", category);
      inventoryItems = inventoryItems.filter(item => {
        if (!item.productId || !item.productId.categoryid) {
          console.log(`Excluding product ${item.productId ? item.productId.name : "unknown"} due to missing category.`);
          return false;
        }
        const prodCatName = item.productId.categoryid.name.toLowerCase();
        const filterCat = category.toLowerCase();
        const match = prodCatName === filterCat;
        console.log(`Comparing product category "${prodCatName}" to filter "${filterCat}": ${match}`);
        return match;
      });
    }

    // 4. Filter to include only products with status "Approved"
    inventoryItems = inventoryItems.filter(item => item.productId && item.productId.status === 'Approved');

    console.log("Filtered Inventory Items:", inventoryItems);
    return res.status(200).json({ products: inventoryItems });
  } catch (error) {
    console.error("Error fetching products by cashier and category:", error);
    return res.status(500).json({ error: error.message });
  }
});



// Example endpoint: GET /api/cashier/:cashierId/orders
router.get('/cashier/:cashierId/orders', async (req, res) => {
  try {
    const cashierId = req.params.cashierId;
    // Find orders where the cashier field equals the logged-in cashier's id
    const orders = await OrderOffline.find({ cashier: cashierId }).populate('items.productId');;
    console.log("ordeeer", orders);
    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders for cashier:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ---------------------------------- home cart -------------
router.post("/homecart/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        status: httpStatusText.FAIL, 
        message: "Invalid productId format" 
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ 
        status: httpStatusText.FAIL, 
        message: "Quantity must be greater than zero" 
      });
    }

    // Check if the product exists
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ 
        status: httpStatusText.FAIL, 
        message: "Product not found" 
      });
    }

    // Check overall product stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        status: httpStatusText.FAIL, 
        message: "Insufficient product stock" 
      });
    }

    // Get the user
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: httpStatusText.FAIL, 
        message: "User not found" 
      });
    }

    // Update user's cart
    const existingItem = user.cartItems.find(item => item.productId.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({ productId, quantity, price });
    }
    await user.save();

    // Update inventory using the new inventory schema:
    // Find the inventory document that contains this product in its "products" array.
    const inventory = await Inventory.findOne({ "products.productId": productId });
    if (inventory) {
      // Locate the subdocument for this product.
      const prodSubdoc = inventory.products.find(prod => prod.productId.equals(productId));
      if (prodSubdoc) {
        // Increase stockOut by the added quantity.
        prodSubdoc.stockOut = (prodSubdoc.stockOut || 0) + quantity;
        prodSubdoc.stockIn = (prodSubdoc.stockIn || 0) - quantity;
        // Note: The available stock in the inventory is computed as stockIn - stockOut.
        await inventory.save();
      } else {
        console.warn("No product subdocument found in inventory for productId:", productId);
      }
    } else {
      console.warn("No inventory record found for productId:", productId);
    }

    // Decrease the overall product stock by the quantity added.
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    // Update JWT with the new cart data, if needed.
    const token = jwt.sign(
      { userId: user._id, cartItems: user.cartItems },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      status: httpStatusText.SUCCESS, 
      cartItems: user.cartItems, 
      token 
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ 
      status: httpStatusText.ERROR, 
      message: "Server error" 
    });
  }
});


router.put('/homeupdate/:id', async (req, res) => {
  try {
    const itemId = req.params.id; // The product ID in the cart item
    const { userId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: "Quantity must be greater than zero",
      });
    }

    // Find the user and the specific cart item
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "User not found",
      });
    }

    const cartItem = user.cartItems.find(item => item.productId.equals(itemId));
    if (!cartItem) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "Cart item not found",
      });
    }

    // Calculate the change in quantity (delta)
    const oldQuantity = cartItem.quantity;
    const delta = quantity - oldQuantity;

    // Check product stock if increasing quantity
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: "Product not found",
      });
    }
    if (delta > 0 && product.stock < delta) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        message: "Insufficient product stock",
      });
    }
    cartItem.quantity = quantity;
    await user.save();
    const inventory = await Inventory.findOne({ "products.productId": itemId });
    if (inventory) {
      // Find the subdocument for this product
      const prodSubdoc = inventory.products.find(p => p.productId.equals(itemId));
      if (prodSubdoc) {
        prodSubdoc.stockOut = (prodSubdoc.stockOut || 0) + delta;
        prodSubdoc.stockIn = (prodSubdoc.stockIn || 0) - delta;
        // Note: Current available stock can be computed as (stockIn - stockOut).
        await inventory.save();
      } else {
        console.warn("No inventory subdocument found for productId:", itemId);
      }
    } else {
      console.warn("No inventory record found for productId:", itemId);
    }
    await Product.findByIdAndUpdate(itemId, { $inc: { stock: -delta } });

    // Optionally, update the JWT with the new cart data.
    const token = jwt.sign(
      { userId: user._id, cartItems: user.cartItems },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: user.cartItems,
      token,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(err.statusCode || 500).json({
      status: httpStatusText.ERROR,
      message: err.message,
    });
  }
});



router.delete('/homeitems/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.query.userId;
    
    // Get the user (or guest cart if user not found)
    const user = await userRepo.getUserById(userId);
    if (!user) {
      // For guests, remove from guest cart.
      const updatedCart = await cartService.removeFromGuestCart(productId);
      return res.status(200).json({ status: httpStatusText.SUCCESS, data: updatedCart });
    }
    
    // Find the index of the cart item that matches the productId
    const itemIndex = user.cartItems.findIndex(item => item.productId == productId);
    if (itemIndex === -1) {
      return res.status(400).json({ status: httpStatusText.FAIL, message: "Item does not exist" });
    }
    
    // Get the quantity of the item to be removed
    const removedItem = user.cartItems[itemIndex];
    const quantity = removedItem.quantity;
    
    // Remove the item from the user's cart
    user.cartItems.splice(itemIndex, 1);
    await user.save();
    const inventory = await Inventory.findOne({ "products.productId": productId });
    if (inventory) {
      // Locate the subdocument for this product
      const productSubdoc = inventory.products.find(subDoc =>
        subDoc.productId.equals(productId)
      );
      
      if (productSubdoc) {
        productSubdoc.stockOut = (productSubdoc.stockOut || 0) - quantity;
        productSubdoc.stockIn = (productSubdoc.stockIn || 0) + quantity;
      } else {
        console.warn("No subdocument found for productId:", productId);
      }
      
      await inventory.save();
    } else {
      console.warn("No inventory document found containing productId:", productId);
    }
    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
    
    return res.status(200).json({ status: httpStatusText.SUCCESS, data: user.cartItems });
  } catch (err) {
    console.error("Error removing cart item:", err);
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: err.message
    });
  }
});


router.delete("/homeclear/:id", async (req, res) => {
  try {
    const userId = req.params.id;
  
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: httpStatusText.FAIL, 
        message: "User not found" 
      });
    }
  
    // Iterate over each cart item to reverse inventory and product stock changes
    for (const cartItem of user.cartItems) {
      const { productId, quantity } = cartItem;
  
      // Find the Inventory document that contains this product
      const inventory = await Inventory.findOne({ "products.productId": productId });
      if (inventory) {
        // Find the subdocument for this product
        const prodSubdoc = inventory.products.find(p => p.productId.equals(productId));
        if (prodSubdoc) {
          // Reverse the effect of the previous "sale"
          // Assuming that when the item was added, stockOut was increased,
          // now we decrease stockOut by the removed quantity.
          prodSubdoc.stockOut = (prodSubdoc.stockOut || 0) - quantity;
          prodSubdoc.stockIn = (prodSubdoc.stockIn || 0) + quantity;
          // Available stock is computed as (stockIn - stockOut)
        } else {
          console.warn("No inventory subdocument found for productId:", productId);
        }
        await inventory.save();
      } else {
        console.warn("No inventory record found for productId:", productId);
      }
  
      // Update the overall product stock: increase stock by the removed quantity
      await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
    }
  
    // Clear the user's cart items
    user.cartItems = [];
    await user.save();
  
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: user.cartItems, // Should be empty now
    });
  
  } catch (err) {
    console.error("Error clearing cart:", err);
    return res.status(err.statusCode || 500).json({
      status: httpStatusText.ERROR,
      message: err.message,
    });
  }
});


  return router;
})();

