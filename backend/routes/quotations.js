const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

// Get quotations, optional filter by paid status: /api/quotations?paid=true|false
router.get('/', async (req, res) => {
  try {
    const quotations = await supabaseService.getAllQuotations();
    
    let filteredQuotations = quotations;
    if (typeof req.query.paid !== 'undefined') {
      const paidFilter = req.query.paid === 'true';
      filteredQuotations = quotations.filter(q => q.paid === paidFilter);
    }
    
    res.json(filteredQuotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single quotation
router.get('/:id', async (req, res) => {
  try {
    const quotation = await supabaseService.getQuotationById(req.params.id);
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
    // Only send the data that frontend actually provides
    const quotationData = {
      brand: req.body.brand,
      customerName: req.body.customerName,
      date: req.body.date,
      products: req.body.products,
      subtotal: req.body.subtotal,
      gst: req.body.gst,
      total: req.body.total,
      paid: req.body.paid || false
      // Don't send terms or contactInfo - let database defaults handle them
    };
    
    const created = await supabaseService.createQuotation(quotationData);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update quotation
router.put('/:id', async (req, res) => {
  try {
    const quotation = await supabaseService.updateQuotation(req.params.id, req.body);
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
    
    const quotation = await supabaseService.updateQuotation(req.params.id, { paid });
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
    const quotation = await supabaseService.deleteQuotation(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 