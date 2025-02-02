const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator'); //this npm package used for validate before saving in db

const addressSchema = new mongoose.Schema({
      street: { type: String},
      city: { type: String, required: true },
      governorate: { type: String, required: true },
})

const userSchema = new mongoose.Schema({
  firstName: { type: String},
  lastName: { type: String},
  email: { type: String, required: true, unique: true ,validate:[validator.isEmail,'filed must be a valid email address']},
  password: { type: String, required: true },
  token: { type: String },
  role: {
    type: String,
    enum: ['Customer', 'Manager', 'SalesClerk', 'Cashier', 'Supplier', 'Admin'], // replace cashier
    required: true,
    default: 'Customer'
  },
  cartItems: {
    type: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  profile: {
    firstName: { type: String},
    lastName: { type: String},
    gender: { type: String, enum: ['male', 'female']},
    dateOfBirth: { type: Date },
    address: addressSchema,
    contactNo: { type: String },
    image: { type: String, default: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  products: { type: Array, default: [] },
  orderIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Order',
    default: []
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

}, { timestamps: true });
 




// Update the `updatedAt` field whenever the document is saved (before saving the doc)
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('User', userSchema);
