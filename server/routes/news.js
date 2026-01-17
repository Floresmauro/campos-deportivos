const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all news (public)
router.get('/', async (req, res) => {
    try {
        const { limit = 10, offset = 0, published = true } = req.query;

        let query = supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by published status if specified
        if (published === 'true' || published === true) {
            query = query.eq('published', true);
        }

        const { data, error, count } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            data,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: count
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single news item (public)
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'News item not found' });
    }
});

// Create news (admin only)
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { title, content, excerpt, image_url, published } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: 'Title and content are required'
            });
        }

        const { data, error } = await supabase
            .from('news')
            .insert([{
                title,
                content,
                excerpt,
                image_url,
                published: published || false,
                author_id: req.user.id
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update news (admin only)
router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { title, content, excerpt, image_url, published } = req.body;

        const { data, error } = await supabase
            .from('news')
            .update({
                title,
                content,
                excerpt,
                image_url,
                published,
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete news (admin only)
router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ message: 'News item deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
