require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client (available globally if needed)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Campos Deportivos API is running',
        version: '1.0.0',
        status: 'healthy'
    });
});

// Auth routes (public)
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/users', require('./routes/users'));
app.use('/api/stadiums', require('./routes/stadiums'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/requests', require('./routes/requests'));

// New routes
app.use('/api/news', require('./routes/news'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/qr', require('./routes/qr'));

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
