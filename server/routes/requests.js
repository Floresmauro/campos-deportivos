const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all requests (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('requests')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's own requests
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create request
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, start_date, end_date, reason } = req.body;

        const { data, error } = await supabase
            .from('requests')
            .insert([{
                user_id: req.user.id,
                type,
                start_date,
                end_date,
                reason,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update request status (admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status, admin_notes } = req.body;

        const { data, error } = await supabase
            .from('requests')
            .update({ status, admin_notes })
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
