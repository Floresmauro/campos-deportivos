require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/stadiums', require('./routes/stadiums'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Campos Deportivos API is running');
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
