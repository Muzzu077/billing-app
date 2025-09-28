const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, required: true },
  listPrice: { type: Number, required: true },
  coilPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const quotationSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  customerName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  products: [productSchema],
  subtotal: { type: Number, required: true },
  gst: { type: Number, required: true },
  total: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  terms: {
    taxes: { type: String, default: "Including taxes @18%" },
    validity: { type: String, default: "Validity only 3 days" },
    supply: { type: String, default: "Material Supply 7 working Days" }
  },
  contactInfo: {
    name: { type: String, default: "T THRINATH REDDY (Deputy Manager)" },
    phone: { type: String, default: "8125237316" }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema); 