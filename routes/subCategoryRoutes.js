const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');

// GET all subcategories
router.get('/all', async (req, res) => {
  try {
    const data = await SubCategory.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;