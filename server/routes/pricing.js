const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get all pricing plans
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [plans] = await pool.execute(`
      SELECT id, name, price, priceID, yearly_price, yearly_priceID,
             monthly_minutes, description, features, button_text,
             is_highlighted, is_popular, extra_minute_cost,
             requires_recharge, per_file_minutes_limit,
             per_meeting_minutes_limit, total_lifetime_minutes,
             created_at, updated_at
      FROM plans 
      ORDER BY price ASC
    `);

        // Parse JSON features
        const plansWithParsedFeatures = plans.map(plan => ({
            ...plan,
            features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
        }));

        res.json(plansWithParsedFeatures);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create pricing plan
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            name, price, priceID, yearly_price, yearly_priceID,
            monthly_minutes, description, features, button_text,
            is_highlighted, is_popular, extra_minute_cost,
            requires_recharge, per_file_minutes_limit,
            per_meeting_minutes_limit, total_lifetime_minutes
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO plans (
        name, price, priceID, yearly_price, yearly_priceID,
        monthly_minutes, description, features, button_text,
        is_highlighted, is_popular, extra_minute_cost,
        requires_recharge, per_file_minutes_limit,
        per_meeting_minutes_limit, total_lifetime_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, price, priceID, yearly_price, yearly_priceID,
                monthly_minutes, description, JSON.stringify(features), button_text,
                is_highlighted || false, is_popular || false, extra_minute_cost,
                requires_recharge || false, per_file_minutes_limit,
                per_meeting_minutes_limit, total_lifetime_minutes
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Pricing plan created successfully',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update pricing plan
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {
            name, price, priceID, yearly_price, yearly_priceID,
            monthly_minutes, description, features, button_text,
            is_highlighted, is_popular, extra_minute_cost,
            requires_recharge, per_file_minutes_limit,
            per_meeting_minutes_limit, total_lifetime_minutes
        } = req.body;

        const [result] = await pool.execute(
            `UPDATE plans 
       SET name = ?, price = ?, priceID = ?, yearly_price = ?, yearly_priceID = ?,
           monthly_minutes = ?, description = ?, features = ?, button_text = ?,
           is_highlighted = ?, is_popular = ?, extra_minute_cost = ?,
           requires_recharge = ?, per_file_minutes_limit = ?,
           per_meeting_minutes_limit = ?, total_lifetime_minutes = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
            [
                name, price, priceID, yearly_price, yearly_priceID,
                monthly_minutes, description, JSON.stringify(features), button_text,
                is_highlighted, is_popular, extra_minute_cost,
                requires_recharge, per_file_minutes_limit,
                per_meeting_minutes_limit, total_lifetime_minutes, req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pricing plan not found' });
        }

        res.json({ success: true, message: 'Pricing plan updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete pricing plan
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM plans WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pricing plan not found' });
        }

        res.json({ success: true, message: 'Pricing plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;