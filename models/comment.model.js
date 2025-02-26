const mongoose = require('mongoose');
const validator = require('validator');

const CommentSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
email: { type: String, required: true },
message: { type: String, required: true },
createdAt: { type: Date, default: Date.now }

})
module.exports = mongoose.model('Comment', CommentSchema);
