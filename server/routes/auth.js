const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('full_name').notEmpty().withMessage('El nombre completo es requerido'),
    body('role').isIn(['admin', 'manager', 'employee']).withMessage('Rol inválido'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    validate
];

// Login
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Get user profile with role
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        res.json({
            user: data.user,
            session: data.session,
            profile
        });
    } catch (err) {
        res.status(401).json({ error: err.message || 'Invalid credentials' });
    }
});

// Register (Admin only - requires valid admin token)
router.post('/register', registerValidation, async (req, res) => {
    try {
        const { email, password, full_name, role, phone, assigned_stadium_id } = req.body;

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (authError) throw authError;

        // Create profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: authData.user.id,
                email,
                full_name,
                role,
                phone,
                assigned_stadium_id
            }])
            .select()
            .single();

        if (profileError) {
            // Rollback: delete auth user if profile creation fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw profileError;
        }

        res.status(201).json({
            message: 'User created successfully',
            user: authData.user,
            profile
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            await supabase.auth.signOut();
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token
        });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// Get current session
router.get('/session', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        // Get profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        res.json({ user, profile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Request password reset
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.CLIENT_URL}/reset-password`
        });

        if (error) throw error;

        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update password
router.post('/update-password', async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authorization required' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        const { data, error } = await supabase.auth.updateUser({
            password
        });

        if (error) throw error;

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
