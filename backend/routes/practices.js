const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/practices - Get all practices
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM practices ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching practices:', error);
    res.status(500).json({ error: 'Failed to fetch practices' });
  }
});

// GET /api/practices/:id - Get practice by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM practices WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Practice not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching practice:', error);
    res.status(500).json({ error: 'Failed to fetch practice' });
  }
});

// POST /api/practices - Create new practice
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO practices (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    const [newPractice] = await pool.execute(
      'SELECT * FROM practices WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newPractice[0]);
  } catch (error) {
    console.error('Error creating practice:', error);
    res.status(500).json({ error: 'Failed to create practice' });
  }
});

// PUT /api/practices/:id - Update practice
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const [result] = await pool.execute(
      'UPDATE practices SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Practice not found' });
    }
    
    const [updatedPractice] = await pool.execute(
      'SELECT * FROM practices WHERE id = ?',
      [id]
    );
    
    res.json(updatedPractice[0]);
  } catch (error) {
    console.error('Error updating practice:', error);
    res.status(500).json({ error: 'Failed to update practice' });
  }
});

// DELETE /api/practices/:id - Delete practice
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM practices WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Practice not found' });
    }
    
    res.json({ message: 'Practice deleted successfully' });
  } catch (error) {
    console.error('Error deleting practice:', error);
    res.status(500).json({ error: 'Failed to delete practice' });
  }
});

module.exports = router;