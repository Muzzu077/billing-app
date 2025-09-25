const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/logos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single brand
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new brand
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const brandData = {
      name: req.body.name,
      tagline: req.body.tagline,
      category: req.body.category
    };
    
    if (req.file) {
      brandData.logo = `/uploads/logos/${req.file.filename}`;
    }
    
    const brand = new Brand(brandData);
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update brand
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const brandData = {
      name: req.body.name,
      tagline: req.body.tagline,
      category: req.body.category
    };
    
    if (req.file) {
      brandData.logo = `/uploads/logos/${req.file.filename}`;
    }
    
    const brand = await Brand.findByIdAndUpdate(req.params.id, brandData, { new: true });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete brand (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 