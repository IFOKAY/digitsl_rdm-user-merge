const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/pending-approvals
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pending_approvals ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// GET /api/pending-approvals/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM pending_approvals WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pending approval not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching pending approval:', error);
    res.status(500).json({ error: 'Failed to fetch pending approval' });
  }
});

// POST /api/submit-for-approval
router.post('/submit-for-approval', async (req, res) => {
  try {
    const { user_email, approval_data } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO pending_approvals (user_email, approval_data, status) VALUES (?, ?, ?)',
      [user_email, JSON.stringify(approval_data), 'pending']
    );
    
    res.status(201).json({
      message: 'Submitted for approval successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error submitting for approval:', error);
    res.status(500).json({ error: 'Failed to submit for approval' });
  }
});

module.exports = router;