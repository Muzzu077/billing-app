const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const supabaseService = require('./services/supabaseService');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Ensure uploads directory exists only when running in an environment with a writable filesystem
if (!process.env.VERCEL) {
  try {
    fs.mkdirSync(path.join(__dirname, 'uploads', 'logos'), { recursive: true });
    app.use(express.static(path.join(__dirname, 'uploads')));
  } catch {
    // noop
  }
}

// Initialize Supabase connection on cold start
supabaseService.initializeSupabase();

// Routes
const authRoutes = require('./routes/auth');
const quotationRoutes = require('./routes/quotations');
const brandRoutes = require('./routes/brands');
const productRoutes = require('./routes/products');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Billing App API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);

// Handle 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = app;



