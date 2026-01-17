const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin, requireAdminOrManager } = require('../middleware/roleMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all courses (public)
router.get('/', async (req, res) => {
    try {
        const { active = 'true' } = req.query;

        let query = supabase
            .from('courses')
            .select('*')
            .order('start_date', { ascending: false });

        if (active === 'true') {
            query = query.eq('active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single course with enrollments
router.get('/:id', async (req, res) => {
    try {
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (courseError) throw courseError;

        // Get enrollment count
        const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', req.params.id);

        res.json({
            ...course,
            enrolled_count: count || 0
        });
    } catch (err) {
        res.status(404).json({ error: 'Course not found' });
    }
});

// Create course (admin only)
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { title, description, instructor, start_date, end_date, max_students, location } = req.body;

        if (!title || !start_date) {
            return res.status(400).json({
                error: 'Title and start_date are required'
            });
        }

        const { data, error } = await supabase
            .from('courses')
            .insert([{
                title,
                description,
                instructor,
                start_date,
                end_date,
                max_students,
                location,
                active: true
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update course (admin only)
router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { title, description, instructor, start_date, end_date, max_students, location, active } = req.body;

        const { data, error } = await supabase
            .from('courses')
            .update({
                title,
                description,
                instructor,
                start_date,
                end_date,
                max_students,
                location,
                active
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

// Delete course (admin only)
router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Enroll in course (authenticated users)
router.post('/:id/enroll', authMiddleware, async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;

        // Check if course exists and is active
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*, course_enrollments(count)')
            .eq('id', courseId)
            .eq('active', true)
            .single();

        if (courseError) throw new Error('Course not found or inactive');

        // Check if already enrolled
        const { data: existing } = await supabase
            .from('course_enrollments')
            .select('id')
            .eq('course_id', courseId)
            .eq('user_id', userId)
            .single();

        if (existing) {
            return res.status(409).json({ error: 'Already enrolled in this course' });
        }

        // Check capacity
        const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId);

        if (course.max_students && count >= course.max_students) {
            return res.status(400).json({ error: 'Course is full' });
        }

        // Create enrollment
        const { data, error } = await supabase
            .from('course_enrollments')
            .insert([{
                course_id: courseId,
                user_id: userId,
                status: 'enrolled'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get enrolled students (admin/manager)
router.get('/:id/students', authMiddleware, requireAdminOrManager, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('course_enrollments')
            .select('*, profiles(id, full_name, email)')
            .eq('course_id', req.params.id);

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's enrolled courses
router.get('/user/:userId/enrollments', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('course_enrollments')
            .select('*, courses(*)')
            .eq('user_id', req.params.userId);

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
