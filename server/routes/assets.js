const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// List all assets
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('assets')
            .select('*, stadiums(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single asset
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'Asset not found' });
    }
});

// Create asset (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('assets')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update asset (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('assets')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete asset (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Asset deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
