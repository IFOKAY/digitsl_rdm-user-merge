const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/user - Get current user (from session/token)
router.get('/', async (req, res) => {
  try {
    // For demo purposes, return a mock user
    // In production, this would get user from JWT token or session
    const mockUser = {
      id: 1,
      email: 'demo@ibm.com',
      name: 'Demo User',
      role: 'user',
      department: 'Technology',
      manager: 'manager@ibm.com'
    };
    
    res.json(mockUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, department, manager, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, manager } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, department = ?, manager = ? WHERE id = ?',
      [name, department, manager, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const [updatedUser] = await pool.execute(
      'SELECT id, email, name, role, department, manager FROM users WHERE id = ?',
      [id]
    );
    
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;