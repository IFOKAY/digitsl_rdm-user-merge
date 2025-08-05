const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/user-skills - Get all user skills
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM user_skills');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});

// GET /api/user-skills/user/:userId - Get skills by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM user_skills WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});

// GET /api/user-skills/practice-area/:practiceAreaId - Get skills by practice area
router.get('/practice-area/:practiceAreaId', async (req, res) => {
  try {
    const { practiceAreaId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM user_skills WHERE practice_area_id = ?', [practiceAreaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});

// GET /api/user-skills/:id - Get user skill by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM user_skills WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User skill not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user skill:', error);
    res.status(500).json({ error: 'Failed to fetch user skill' });
  }
});

// POST /api/user-skills - Create new user skill
router.post('/', async (req, res) => {
  try {
    const { user_id, skill_name, proficiency_level, practice_area_id } = req.body;
    
    if (!user_id || !skill_name) {
      return res.status(400).json({ error: 'User ID and skill name are required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO user_skills (user_id, skill_name, proficiency_level, practice_area_id) VALUES (?, ?, ?, ?)',
      [user_id, skill_name, proficiency_level, practice_area_id]
    );
    
    const [newUserSkill] = await pool.execute(
      'SELECT * FROM user_skills WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newUserSkill[0]);
  } catch (error) {
    console.error('Error creating user skill:', error);
    res.status(500).json({ error: 'Failed to create user skill' });
  }
});

// PUT /api/user-skills/:id - Update user skill
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_name, proficiency_level, practice_area_id } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE user_skills SET skill_name = ?, proficiency_level = ?, practice_area_id = ? WHERE id = ?',
      [skill_name, proficiency_level, practice_area_id, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User skill not found' });
    }
    
    const [updatedUserSkill] = await pool.execute(
      'SELECT * FROM user_skills WHERE id = ?',
      [id]
    );
    
    res.json(updatedUserSkill[0]);
  } catch (error) {
    console.error('Error updating user skill:', error);
    res.status(500).json({ error: 'Failed to update user skill' });
  }
});

// DELETE /api/user-skills/:id - Delete user skill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM user_skills WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User skill not found' });
    }
    
    res.json({ message: 'User skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting user skill:', error);
    res.status(500).json({ error: 'Failed to delete user skill' });
  }
});

module.exports = router;