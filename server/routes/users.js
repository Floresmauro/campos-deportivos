const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
    // TODO: Fetch from public.profiles using req.user.id
    res.json({ user: req.user, message: 'User profile' });
});

module.exports = router;
