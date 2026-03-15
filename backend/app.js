const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dbService = require('./services/dbService');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Initialize Database connection on cold start
dbService.connect();


// Routes
const authRoutes = require('./routes/auth');
const quotationRoutes = require('./routes/quotations');
const brandRoutes = require('./routes/brands');
const productRoutes = require('./routes/products');

// Health check
app.get('/api/health', async (req, res) => {
  const dbStatus = { connected: false };
  try {
    const pool = dbService.getPool();
    if (pool) {
      const result = await pool.query('SELECT NOW() as time, (SELECT count(*) FROM admins) as admin_count');
      dbStatus.connected = true;
      dbStatus.time = result.rows[0].time;
      dbStatus.adminCount = Number(result.rows[0].admin_count);
    }
  } catch (e) {
    dbStatus.error = e.message;
  }
  res.json({
    status: 'OK',
    message: 'Billing App API is running',
    database: dbStatus,
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
  });
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



