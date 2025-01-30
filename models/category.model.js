const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        required: true
    }
});
 
module.exports = mongoose.model('Category', CategorySchema);