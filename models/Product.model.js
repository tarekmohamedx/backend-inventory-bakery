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
        required: true
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
        default: Date.now 
    },
    // supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Link to Supplier
    updatedAt: {
        type: Date,
        default: Date.now },
    images: {
        type: [String]
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accentColor: { type: String, default: '#0B374D' },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Out of Stock'],
        default: 'Pending'
    },
    branch: {
        type: [String]
    },
});

const product = mongoose.model('Product', productSchema);
module.exports = product;