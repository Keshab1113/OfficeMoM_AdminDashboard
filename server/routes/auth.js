const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Input validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Admin login - Check against database
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists in database
    const [users] = await pool.execute(
      `SELECT id, fullName, email, password, isVerified, profilePic, 
              isGoogleUser, isFacebookUser, created_at 
       FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check if this is the admin user (Keshab Das)
    // You can also create an isAdmin field in your database for better management
    const isAdminUser = user.id === 63 && user.email === 'keshabdas2003@gmail.com';

    if (!isAdminUser) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // For Google users, they don't have passwords in your database
    // So we'll allow login without password verification for admin Google users
    if (user.isGoogleUser) {
      // Generate token for Google admin user without password check
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          name: user.fullName,
          role: 'admin',
          timestamp: Date.now()
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          profilePic: user.profilePic,
          role: 'admin'
        }
      });
    }

    // For non-Google users, check password (if you have password field populated)
    if (user.password) {
      // If you have passwords stored, use bcrypt to verify
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }
    } else {
      // If no password is set and not Google user, require password
      return res.status(401).json({
        success: false,
        error: 'Password required for this account'
      });
    }

    // Generate token for successful login
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.fullName,
        role: 'admin',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        profilePic: user.profilePic,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
});

// Verify token endpoint
router.post('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Verify user still exists in database
    const [users] = await pool.execute(
      'SELECT id, fullName, email, profilePic FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }

    const user = users[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        profilePic: user.profilePic,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;