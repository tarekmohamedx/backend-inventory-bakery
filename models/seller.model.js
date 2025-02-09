import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 

  const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, 
    address: { type: String },
    storeName: { type: String, required: true }, 
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference products
    totalSales: { type: Number, default: 0 },
    totalProfits: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);
//  Pre-save Middleware: Hash Password Before Saving
sellerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  export default mongoose.model('Seller', sellerSchema);