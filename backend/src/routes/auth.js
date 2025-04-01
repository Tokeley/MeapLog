const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    
    // Find user
    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      console.log('User is not admin');
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check password using the model's method
    const validPassword = await user.comparePassword(password);
    console.log('Password valid:', validPassword);
    
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response with token and user (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    console.log('Login successful for user:', username);
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router; 