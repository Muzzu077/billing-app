const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const { requireAuth } = require('./middleware');

router.use(requireAuth);

const buildBrandPayload = (body) => ({
  name: body.name,
  tagline: body.tagline || null,
  category: body.category || null,
  logo: body.logo || null,
});

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await dbService.getAllBrands();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single brand
router.get('/:id', async (req, res) => {
  try {
    const brand = await dbService.getBrandById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new brand
router.post('/', async (req, res) => {
  try {
    const brandData = {
      ...buildBrandPayload(req.body),
      is_active: true,
    };

    if (!brandData.name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const newBrand = await dbService.createBrand(brandData);
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update brand
router.put('/:id', async (req, res) => {
  try {
    const brandData = buildBrandPayload(req.body);

    const brand = await dbService.updateBrand(req.params.id, brandData);
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
    const brand = await dbService.deleteBrand(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 