const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');

// Get quotations, optional filter by paid status: /api/quotations?paid=true|false
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (typeof req.query.paid !== 'undefined') {
      filter.paid = req.query.paid === 'true';
    }
    const quotations = await Quotation.find(filter).sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single quotation
router.get('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new quotation
router.post('/', async (req, res) => {
  try {
    const quotation = new Quotation(req.body);
    const created = await quotation.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update quotation
router.put('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark quotation paid/unpaid
router.patch('/:id/paid', async (req, res) => {
  try {
    const { paid } = req.body;
    if (typeof paid !== 'boolean') {
      return res.status(400).json({ message: 'paid must be boolean' });
    }
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, { $set: { paid } }, { new: true });
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete quotation
router.delete('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 