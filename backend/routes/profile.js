const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/profile/:email - Get user profile by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const [profiles] = await pool.execute(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    );
    
    if (profiles.length === 0) {
      // Return default profile structure if not found
      const defaultProfile = {
        email: email,
        name: '',
        department: '',
        manager: '',
        skills: [],
        certifications: [],
        highImpactAssets: []
      };
      return res.json(defaultProfile);
    }
    
    res.json(profiles[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile/:email - Update user profile
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const profileData = req.body;
    
    // Check if profile exists
    const [existingProfiles] = await pool.execute(
      'SELECT id FROM user_profiles WHERE email = ?',
      [email]
    );
    
    if (existingProfiles.length === 0) {
      // Create new profile
      const [result] = await pool.execute(
        'INSERT INTO user_profiles (email, profile_data) VALUES (?, ?)',
        [email, JSON.stringify(profileData)]
      );
      
      const [newProfile] = await pool.execute(
        'SELECT * FROM user_profiles WHERE id = ?',
        [result.insertId]
      );
      
      res.status(201).json(newProfile[0]);
    } else {
      // Update existing profile
      await pool.execute(
        'UPDATE user_profiles SET profile_data = ?, updated_at = NOW() WHERE email = ?',
        [JSON.stringify(profileData), email]
      );
      
      const [updatedProfile] = await pool.execute(
        'SELECT * FROM user_profiles WHERE email = ?',
        [email]
      );
      
      res.json(updatedProfile[0]);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profiles/:email/profile - Alternative endpoint for profile
router.get('/profiles/:email/profile', async (req, res) => {
  try {
    const { email } = req.params;
    
    const [profiles] = await pool.execute(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    );
    
    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profiles[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;