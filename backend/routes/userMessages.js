const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/user-messages/:email/unread
router.get('/:email/unread', async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_messages WHERE user_email = ? AND is_read = false',
      [email]
    );
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ error: 'Failed to fetch unread messages' });
  }
});

// GET /api/user-messages/:email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM user_messages WHERE user_email = ? ORDER BY created_at DESC',
      [email]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ error: 'Failed to fetch user messages' });
  }
});

// PUT /api/user-messages/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'UPDATE user_messages SET is_read = true WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router;