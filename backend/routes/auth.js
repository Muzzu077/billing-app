const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await admin.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        displayName: admin.displayName,
        priceMultiplier: admin.priceMultiplier,
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
    const admin = await Admin.findById(payload.sub);
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });
    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        displayName: admin.displayName,
        priceMultiplier: admin.priceMultiplier,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


