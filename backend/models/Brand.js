const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String }, // Path to logo file
  tagline: { type: String, default: "powering lives" },
  category: { type: String, default: "HR-FR" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', brandSchema); 