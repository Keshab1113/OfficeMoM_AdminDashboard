const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get all FAQs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, search = '' } = req.query;

    let query = `
      SELECT id, question, answer, category, need_for, 
             display_order, is_active, created_at, updated_at
      FROM faqs 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (question LIKE ? OR answer LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY display_order ASC, created_at DESC`;

    const [faqs] = await pool.execute(query, params);
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create FAQ
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { question, answer, category, need_for, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO faqs (question, answer, category, need_for, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [question, answer, category, need_for, display_order || 0, is_active || true]
    );

    res.status(201).json({ 
      success: true, 
      message: 'FAQ created successfully',
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update FAQ
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { question, answer, category, need_for, display_order, is_active } = req.body;

    const [result] = await pool.execute(
      `UPDATE faqs 
       SET question = ?, answer = ?, category = ?, need_for = ?, 
           display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [question, answer, category, need_for, display_order, is_active, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ success: true, message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete FAQ
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM faqs WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;