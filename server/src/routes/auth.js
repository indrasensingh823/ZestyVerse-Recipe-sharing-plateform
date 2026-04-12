const express = require('express');
const router = express.Router();

// Simple auth verification endpoint
router.post('/verify', async (req, res) => {
  try {
    const { user } = req.body;
    
    // In a real app, you would verify Firebase token here
    // For simplicity, we'll just return the user data
    res.json({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      picture: user.photoURL
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

module.exports = router;