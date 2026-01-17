const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// List all stadiums
router.get('/', async (req, res) => {
    // TODO: Fetch all stadiums from DB
    res.json({ message: 'List of stadiums' });
});

// Create stadium (Protected)
router.post('/', authMiddleware, async (req, res) => {
    res.json({ message: 'Create stadium' });
});

module.exports = router;
