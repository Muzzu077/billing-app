const express = require('express');
const jwt = require('jsonwebtoken');
const supabaseService = require('../services/supabaseService');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const isValid = await supabaseService.verifyAdminPassword(username, password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = await supabaseService.getAdmin(username);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        displayName: admin.display_name,
        priceMultiplier: admin.price_multiplier,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const admin = await supabaseService.getAdmin(payload.username);
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });
    
    res.json({
      admin: {
        id: admin.id,
        username: admin.username,
        displayName: admin.display_name,
        priceMultiplier: admin.price_multiplier,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


