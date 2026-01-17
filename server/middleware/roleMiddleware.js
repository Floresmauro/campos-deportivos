const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of roles
 */
const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Ensure user is authenticated first
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            // Get user profile with role
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', req.user.id)
                .single();

            if (error || !profile) {
                return res.status(403).json({ error: 'User profile not found' });
            }

            // Normalize allowedRoles to array
            const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

            // Check if user has required role
            if (!roles.includes(profile.role)) {
                return res.status(403).json({
                    error: 'Insufficient permissions',
                    required: roles,
                    current: profile.role
                });
            }

            // Attach role to request for further use
            req.userRole = profile.role;
            next();
        } catch (err) {
            res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware to check if user is admin or manager
 */
const requireAdminOrManager = requireRole(['admin', 'manager']);

module.exports = {
    requireRole,
    requireAdmin,
    requireAdminOrManager
};
