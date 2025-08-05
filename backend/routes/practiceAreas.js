const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/practice-areas - Get all practice areas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM practice_areas ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching practice areas:', error);
    res.status(500).json({ error: 'Failed to fetch practice areas' });
  }
});

// GET /api/practice-areas/practice/:practiceId - Get practice areas by practice ID
router.get('/practice/:practiceId', async (req, res) => {
  try {
    const { practiceId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM practice_areas WHERE practice_id = ? ORDER BY name',
      [practiceId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching practice areas:', error);
    res.status(500).json({ error: 'Failed to fetch practice areas' });
  }
});

// GET /api/practice-areas/:id - Get practice area by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM practice_areas WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Practice area not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching practice area:', error);
    res.status(500).json({ error: 'Failed to fetch practice area' });
  }
});

// POST /api/practice-areas - Create new practice area
router.post('/', async (req, res) => {
  try {
    const { name, description, practice_id } = req.body;
    
    if (!name || !practice_id) {
      return res.status(400).json({ error: 'Name and practice_id are required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO practice_areas (name, description, practice_id) VALUES (?, ?, ?)',
      [name, description, practice_id]
    );
    
    const [newPracticeArea] = await pool.execute(
      'SELECT * FROM practice_areas WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newPracticeArea[0]);
  } catch (error) {
    console.error('Error creating practice area:', error);
    res.status(500).json({ error: 'Failed to create practice area' });
  }
});

// PUT /api/practice-areas/:id - Update practice area
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, practice_id } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE practice_areas SET name = ?, description = ?, practice_id = ? WHERE id = ?',
      [name, description, practice_id, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Practice area not found' });
    }
    
    const [updatedPracticeArea] = await pool.execute(
      'SELECT * FROM practice_areas WHERE id = ?',
      [id]
    );
    
    res.json(updatedPracticeArea[0]);
  } catch (error) {
    console.error('Error updating practice area:', error);
    res.status(500).json({ error: 'Failed to update practice area' });
  }
});

// DELETE /api/practice-areas/:id - Delete practice area
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM practice_areas WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Practice area not found' });
    }
    
    res.json({ message: 'Practice area deleted successfully' });
  } catch (error) {
    console.error('Error deleting practice area:', error);
    res.status(500).json({ error: 'Failed to delete practice area' });
  }
});

module.exports = router;