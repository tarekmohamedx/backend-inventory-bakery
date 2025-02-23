const mongoose = require('mongoose');

const RestockSechema = new mongoose.Schema({
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
    quantity: { type: Number, required: true },
    Status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    responseMessage:{type:String, default: ''}
});

module.exports = mongoose.model('RestockRequest', RestockSechema);
