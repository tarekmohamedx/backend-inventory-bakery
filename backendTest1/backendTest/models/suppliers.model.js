const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Supplier', supplierSchema);
