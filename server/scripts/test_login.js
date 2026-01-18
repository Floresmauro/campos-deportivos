const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testLogin() {
    const email = 'admin@campos.com';
    const password = 'password123';
    console.log(`Testing login for: ${email} with password: ${password}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('❌ Login Failed:', error.message);
    } else {
        console.log('✅ Login Successful!');
        console.log('User ID:', data.user.id);
        console.log('Access Token:', data.session.access_token.substring(0, 20) + '...');
    }
}

testLogin();
