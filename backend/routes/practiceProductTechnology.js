const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/practice-product-technology/practice-area/:practiceAreaId
router.get('/practice-area/:practiceAreaId', async (req, res) => {
  try {
    const { practiceAreaId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM practice_product_technology WHERE practice_area_id = ?',
      [practiceAreaId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching practice product technology:', error);
    res.status(500).json({ error: 'Failed to fetch practice product technology' });
  }
});

module.exports = router;