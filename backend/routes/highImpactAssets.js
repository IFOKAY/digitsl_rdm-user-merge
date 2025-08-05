const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/high-impact-assets/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM high_impact_assets WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching high impact assets:', error);
    res.status(500).json({ error: 'Failed to fetch high impact assets' });
  }
});

// POST /api/high-impact-assets
router.post('/', async (req, res) => {
  try {
    const { user_id, asset_name, description, impact_level } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO high_impact_assets (user_id, asset_name, description, impact_level) VALUES (?, ?, ?, ?)',
      [user_id, asset_name, description, impact_level]
    );
    
    const [newAsset] = await pool.execute(
      'SELECT * FROM high_impact_assets WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newAsset[0]);
  } catch (error) {
    console.error('Error creating high impact asset:', error);
    res.status(500).json({ error: 'Failed to create high impact asset' });
  }
});

// DELETE /api/high-impact-assets/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM high_impact_assets WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'High impact asset not found' });
    }
    
    res.json({ message: 'High impact asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting high impact asset:', error);
    res.status(500).json({ error: 'Failed to delete high impact asset' });
  }
});

module.exports = router;