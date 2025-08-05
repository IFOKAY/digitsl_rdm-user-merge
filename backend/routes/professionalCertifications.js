const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/professional-certifications/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM professional_certifications WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// POST /api/professional-certifications
router.post('/', async (req, res) => {
  try {
    const { user_id, certification_name, issuer, date_obtained } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO professional_certifications (user_id, certification_name, issuer, date_obtained) VALUES (?, ?, ?, ?)',
      [user_id, certification_name, issuer, date_obtained]
    );
    
    const [newCert] = await pool.execute(
      'SELECT * FROM professional_certifications WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newCert[0]);
  } catch (error) {
    console.error('Error creating certification:', error);
    res.status(500).json({ error: 'Failed to create certification' });
  }
});

// DELETE /api/professional-certifications/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM professional_certifications WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ error: 'Failed to delete certification' });
  }
});

module.exports = router;