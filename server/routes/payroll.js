const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin, requireAdminOrManager } = require('../middleware/roleMiddleware');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get payroll records for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const { year, limit = 12 } = req.query;

        // Users can only see their own payroll, admins can see anyone's
        if (req.user.id !== userId && req.userRole !== 'admin') {
            return res.status(403).json({
                error: 'You can only view your own payroll records'
            });
        }

        let query = supabase
            .from('payroll')
            .select('*')
            .eq('user_id', userId)
            .order('year', { ascending: false })
            .order('month', { ascending: false })
            .limit(limit);

        if (year) {
            query = query.eq('year', parseInt(year));
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single payroll record
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payroll')
            .select('*, profiles!payroll_user_id_fkey(full_name, email)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        // Users can only see their own records
        if (data.user_id !== req.user.id && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'Payroll record not found' });
    }
});

// Create/upload payroll record (admin only)
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const {
            user_id,
            month,
            year,
            gross_salary,
            net_salary,
            deductions,
            bonuses,
            file_url,
            notes
        } = req.body;

        // Validate required fields
        if (!user_id || !month || !year) {
            return res.status(400).json({
                error: 'user_id, month, and year are required'
            });
        }

        // Validate month
        if (month < 1 || month > 12) {
            return res.status(400).json({ error: 'Month must be between 1 and 12' });
        }

        // Check if payroll for this user/month/year already exists
        const { data: existing } = await supabase
            .from('payroll')
            .select('id')
            .eq('user_id', user_id)
            .eq('month', month)
            .eq('year', year)
            .single();

        if (existing) {
            return res.status(409).json({
                error: 'Payroll record for this month already exists',
                existing_id: existing.id
            });
        }

        const { data, error } = await supabase
            .from('payroll')
            .insert([{
                user_id,
                month,
                year,
                gross_salary,
                net_salary,
                deductions,
                bonuses,
                file_url,
                notes,
                created_by: req.user.id
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update payroll record (admin only)
router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const {
            gross_salary,
            net_salary,
            deductions,
            bonuses,
            file_url,
            notes
        } = req.body;

        const { data, error } = await supabase
            .from('payroll')
            .update({
                gross_salary,
                net_salary,
                deductions,
                bonuses,
                file_url,
                notes
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

// Delete payroll record (admin only)
router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('payroll')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ message: 'Payroll record deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all payroll records (admin/manager)
router.get('/', authMiddleware, requireAdminOrManager, async (req, res) => {
    try {
        const { year, month, user_id } = req.query;

        let query = supabase
            .from('payroll')
            .select('*, profiles!payroll_user_id_fkey(full_name, email)')
            .order('year', { ascending: false })
            .order('month', { ascending: false });

        if (year) query = query.eq('year', parseInt(year));
        if (month) query = query.eq('month', parseInt(month));
        if (user_id) query = query.eq('user_id', user_id);

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate download URL for payroll file
router.get('/:id/download', authMiddleware, async (req, res) => {
    try {
        // Get payroll record
        const { data: payroll, error: payrollError } = await supabase
            .from('payroll')
            .select('user_id, file_url')
            .eq('id', req.params.id)
            .single();

        if (payrollError) throw payrollError;

        // Check permissions
        if (payroll.user_id !== req.user.id && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!payroll.file_url) {
            return res.status(404).json({ error: 'No file attached to this payroll record' });
        }

        // If file_url is already a full URL, return it
        if (payroll.file_url.startsWith('http')) {
            return res.json({ url: payroll.file_url });
        }

        // Otherwise, generate signed URL from Supabase Storage
        const { data: signedUrl, error: urlError } = await supabase
            .storage
            .from('payroll') // Assumes a 'payroll' bucket exists
            .createSignedUrl(payroll.file_url, 3600); // URL valid for 1 hour

        if (urlError) throw urlError;

        res.json({ url: signedUrl.signedUrl });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
