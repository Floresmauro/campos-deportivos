const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function verifyUser() {
    const email = 'admin@campos.com';
    console.log(`Verifying user: ${email}...`);

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const user = users.find(u => u.email === email);

    if (user) {
        console.log('✅ User found in Auth:');
        console.log(`ID: ${user.id}`);
        console.log(`Email Confirmed At: ${user.email_confirmed_at}`);
        console.log(`Last Sign In: ${user.last_sign_in_at}`);
        console.log(`User Metadata:`, user.user_metadata);
    } else {
        console.error('❌ User NOT found in Auth list.');
    }
}

verifyUser();
