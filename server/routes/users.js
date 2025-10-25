const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get all users with search and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, fullName, email, isVerified, profilePic, 
             isGoogleUser, isFacebookUser, created_at
      FROM users 
      WHERE 1=1
    `;
    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (search) {
      query += ` AND (fullName LIKE ? OR email LIKE ?)`;
      countQuery += ` AND (fullName LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [users] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, fullName, email, isVerified, profilePic, 
              isGoogleUser, isFacebookUser, created_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;