require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos.'
    }
});

// Middleware
app.use(cors());
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(limiter); // Apply rate limiting to all requests

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
app.use('/api/upload', require('./routes/upload'));

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
