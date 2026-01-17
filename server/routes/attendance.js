const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get today's attendance
router.get('/today', authMiddleware, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('attendance')
            .select('*, profiles(full_name)')
            .gte('timestamp', today)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register attendance (check-in or check-out)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, location_lat, location_lng } = req.body;

        const { data, error } = await supabase
            .from('attendance')
            .insert([{
                user_id: req.user.id,
                type,
                location_lat,
                location_lng,
                timestamp: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user's attendance history
router.get('/history/:userId', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('timestamp', { ascending: false })
            .limit(50);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
