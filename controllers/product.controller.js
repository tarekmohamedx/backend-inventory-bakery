const express = require("express");
const ImageKit = require("imagekit");
const productService = require("../services/product.service");

const router = express.Router();

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

// Get product by ID
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

// Get top products (best sellers)
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await productService.getTopProducts();
    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get the last added products
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

// <<<<<<< HEAD
// // Get products by category
// router.get("/products", async (req, res) => {
// =======
//         })
  


//         // Create product
//         router.post("/products", async (req, res) => {
//           try {
//             console.log("Request Body:", req.body);
//             console.log("Uploaded Files:", req.files);

//             // Convert values to correct types
//             const parsedPrice = parseFloat(req.body.price);
//             const parsedStock = parseInt(req.body.stock, 10);
//             const parsedPreviousPrice = req.body.previousprice ? parseFloat(req.body.previousprice) : undefined;
//             const parsedSales = req.body.sales ? parseInt(req.body.sales, 10) : 0;
//             const parsedDiscounted = req.body.discounted === "true"; // Convert "true" string to boolean

//             // Validate required fields (categoryid removed)
//             if (isNaN(parsedPrice) || isNaN(parsedStock)) {
//               return res.status(400).json({
//                 error: "Missing or invalid required fields: `price`, `stock`",
//               });
//             }

//             // Check if images are provided
//             if (!req.files || Object.keys(req.files).length === 0) {
//               return res.status(400).json({ error: "At least one image file is required" });
//             }


//     const status = "Pending";
//     const newProduct = await productService.createProduct({
//       name: req.body.name,
//       description: req.body.description,
//       price: parsedPrice,
//       category: req.body.category,
//       previousprice: parsedPreviousPrice,
//       sales: parsedSales,
//       stock: parsedStock,
//       flavor: req.body.flavor,
//       discounted: parsedDiscounted,
//       categoryid: parsedCategoryId,
//       images: uploadedImages,
//       status:status,
      
//     });
//             // Ensure `req.files.images` is an array
//             // const uploadedFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
//             const uploadedFiles = req.files?.images? (Array.isArray(req.files.images) ? req.files.images : [req.files.images]): [];



//             // Upload images to ImageKit
//             const uploadedImages = await Promise.all(
//               uploadedFiles.map(async (file) => {
//                 try {
//                   const uploaded = await imagekit.upload({
//                     file: file.data,
//                     fileName: file.name,
//                     folder: "/products",
//                   });
//                   return uploaded.url;
//                 } catch (uploadError) {
//                   console.error("Error uploading image:", uploadError);
//                   throw new Error("Image upload failed");
//                 }
//               })
//             );

//             console.log("ImageKit Upload URLs:", uploadedImages);

//             // Create new product without categoryid
//             const newProduct = await Product.create({
//               name: req.body.name,
//               description: req.body.description,
//               price: parsedPrice,
//               previousprice: parsedPreviousPrice,
//               sales: parsedSales,
//               stock: parsedStock,
//               flavor: req.body.flavor,
//               discounted: parsedDiscounted,
//               images: uploadedImages, // Images uploaded successfully
//             });

//             return res.status(201).json(newProduct);
//           } catch (error) {
//             console.error("Error processing product creation:", error);
//             return res.status(500).json({ error: error.message || "Internal Server Error" });
//           }
//         });
        

//         // update products
//         router.put("/products/:id", async(req, res, next) => {

//   try {
//     console.log("Query Params:", req.query);
//     const category = req.query.category;
//     const products = await productService.findByCategory(category);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products by category:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Create a new product
router.post("/products", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const parsedPrice = parseFloat(req.body.price);
    const parsedStock = parseInt(req.body.stock, 10);
    const parsedPreviousPrice = req.body.previousprice ? parseFloat(req.body.previousprice) : undefined;
    const parsedSales = req.body.sales ? parseInt(req.body.sales, 10) : 0;
    const parsedDiscounted = req.body.discounted === "true";
    const parsedCategoryId = req.body.categoryid;

    if (!parsedCategoryId || isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({
        error: "Missing or invalid required fields: `categoryid`, `price`, `stock`",
      });
    }

    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "At least one image file is required" });
    }

    const uploadedFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

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

    const newProduct = await productService.createProduct({
      name: req.body.name,
      description: req.body.description,
      price: parsedPrice,
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
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put("/products/:id", async (req, res) => {
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


  
  
//         // create product
//         router.post("/products", async (req, res) => {
//           try {
//             console.log("Request Body:", req.body);
//             console.log("Uploaded Files:", req.files);
        
//             // Convert values to correct types
//             const parsedPrice = parseFloat(req.body.price);
//             const parsedStock = parseInt(req.body.stock, 10);
//             const parsedPreviousPrice = req.body.previousprice ? parseFloat(req.body.previousprice) : undefined;
//             const parsedSales = req.body.sales ? parseInt(req.body.sales, 10) : 0;
//             const parsedDiscounted = req.body.discounted === "true"; // Convert "true" string to boolean
//             const parsedCategoryId = req.body.categoryid; // Ensure categoryid is passed as a string
        
//             // Validate required fields
//             if (!parsedCategoryId || isNaN(parsedPrice) || isNaN(parsedStock)) {
//               return res.status(400).json({
//                 error: "Missing or invalid required fields: `categoryid`, `price`, `stock`",
//               });
//             }
        
//             if (!req.files || Object.keys(req.files).length === 0) {
//               return res.status(400).json({ error: "At least one image file is required" });
//             }
        
//             // Ensure `req.files.images` is an array
//             const uploadedFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        
//             // Upload images to ImageKit
//             const uploadedImages = await Promise.all(
//               uploadedFiles.map(async (file) => {
//                 const uploaded = await imagekit.upload({
//                   file: file.data,
//                   fileName: file.name,
//                   folder: "/products",
//                 });
//                 return uploaded.url;
//               })
//             );
        
//             console.log("ImageKit Upload URLs:", uploadedImages);
        
//             // Create new product with parsed fields
//             const newProduct = await productService.createProduct({
//               name: req.body.name,
//               description: req.body.description,
//               price: parsedPrice,
//               category: req.body.category,
//               previousprice: parsedPreviousPrice,
//               sales: parsedSales,
//               stock: parsedStock,
//               flavor: req.body.flavor,
//               discounted: parsedDiscounted,
//               categoryid: parsedCategoryId,
//               images: uploadedImages,
//             });
        
//             res.status(201).json(newProduct);
//           } catch (error) {
//             console.error("Error uploading images:", error);
//             res.status(500).json({ error: error.message });
//           }
//         });
        

//         // update products
//         router.put("/products/:id", async(req, res, next) => {
//           try {
//             const updatedProduct = await productService.updateProduct(req.params.id, req.body);
//             if (!updatedProduct) {
//               return res.status(404).json({ error: "This product does not exist :(" });
//             }
//             res.status(200).json(updatedProduct);
//           } catch (error) {
//             console.error("Error updating product:", error);
//             res.status(500).json({ error: error.message });
//           }
//         });
        
      
//         // delete products
//         router.delete("/products/:id", async (req, res) => {
//           try {
//             const deletedProduct = await productService.deleteProduct(req.params.id);
//             if (!deletedProduct) {
//               return res.status(404).json({ error: "This Product does not exist :(" });
//             }
//             res.status(200).json({ message: "Product deleted successfully" });
//           } catch (error) {
//             console.error("Error deleting product:", error);
//             res.status(500).json({ error: error.message });
//           }
//         });

// // Get products by category
//         router.get('/products', async (req, res) => {
//   try {
//             console.log("Query Params:", req.query);
//     const category = req.query.category;
//     const products = await productService.findByCategory(category);
//     res.status(200).json(products);
//   } catch (error) {
//             console.error('Error fetching products:', error);
//     res.status(500).json({ error: error.message });
//   }
// });


  return router;


//   return router;
// })
// })();

