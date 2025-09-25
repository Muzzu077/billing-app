const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  description: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  listPrice: { type: Number, required: true },
  coilPrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema); 