const mongoose = require('mongoose');
const validator = require('validator'); //use this npm package to validate before saving in db
const Inventory = require('./inventory.model');
const Supplier = require('./suppliers.model'); // Import Supplier model for validation

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { 
        type: String
    },
    price: {
        type: Number,
        required: true
    }, 
    category: {
        type: String
    },
    previousprice: {
        type: Number
    },
    sales: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true
    },
    flavor: {
        type: String,
        required: false
    },
    discounted: {
    type: Boolean,
    default: false
    },
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now },
        //new
    // supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Link to Supplier
    updatedAt: {
        type: Date,
        default: Date.now },
    images: {
        type: [String]
    }
});



// // Pre-save middleware to validate the supplier ID
// productSchema.pre('save', async function (next) {
//     try {
//       // Validate that the supplier exists
//       const supplierExists = await Supplier.exists({ _id: this.supplierId });
//       if (!supplierExists) {
//         throw new Error('Invalid supplierId: Supplier does not exist');
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });
  
//   // Post-save middleware to add product to inventory
//   productSchema.post('save', async function (doc, next) {
//     try {
//       // Create inventory entry for the product
//       await Inventory.create({
//         productId: doc._id,
//         stockIn: doc.stock,
//         stockRecord: doc.stock,
//         supplierId: doc.supplierId,
//       });
//       console.log(`Inventory record created for product: ${doc.name}`);
//     } catch (error) {
//       console.error(`Error creating inventory for product: ${doc.name}`, error);
//     }
//     next();
//   });







module.exports = mongoose.model('Product', productSchema);
