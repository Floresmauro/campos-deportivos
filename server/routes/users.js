const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, stadiums(name)')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'Profile not found' });
    }
});

// Get all users (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, stadiums(name)')
            .order('full_name');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single user
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, stadiums(name)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'User not found' });
    }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { full_name, phone, assigned_stadium_id, role } = req.body;

        const { data, error } = await supabase
            .from('profiles')
            .update({ full_name, phone, assigned_stadium_id, role })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
