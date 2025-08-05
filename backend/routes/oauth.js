const express = require('express');
const router = express.Router();

// GET /oauth2/authorization/appid - OAuth login endpoint
router.get('/authorization/appid', (req, res) => {
  // In a real implementation, this would redirect to IBM AppID
  // For now, redirect to a mock login page or directly to the app
  console.log('OAuth login request received');
  
  // Mock successful OAuth login - redirect back to frontend with token
  const mockToken = 'mock-oauth-token-' + Date.now();
  res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/login?token=${mockToken}`);
});

// GET /oauth2/callback - OAuth callback endpoint
router.get('/callback', (req, res) => {
  const { code, state } = req.query;
  
  console.log('OAuth callback received:', { code, state });
  
  // In a real implementation, exchange code for token with IBM AppID
  // For now, redirect to the frontend with success
  res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/dashboard`);
});

// POST /logout - Logout endpoint
router.post('/logout', (req, res) => {
  // Clear any session data
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// GET /logout - Logout endpoint (GET version)
router.get('/logout', (req, res) => {
  // Clear any session data
  res.clearCookie('token');
  res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}/login`);
});

module.exports = router;