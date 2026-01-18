const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
    const email = 'admin@campos.com';
    const password = 'password123';
    const fullName = 'Admin Principal';

    console.log(`Creating admin user: ${email}...`);

    try {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (authError) {
            console.error('❌ Error creating auth user:', authError.message);
            return;
        }

        const userId = authData.user.id;
        console.log(`✅ Auth user created with ID: ${userId}`);

        // 2. Create Profile
        // Check if profile exists first? The insert might fail if unique constraint violated, but it's fine for now.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email,
                full_name: fullName,
                role: 'admin',
                phone: '1234567890'
            })
            .select()
            .single();

        if (profileError) {
            console.error('❌ Error creating profile:', profileError.message);
            // Optionally delete auth user if profile fails
        } else {
            console.log('✅ Admin profile created successfully!');
            console.log(`\n🎉 Credentials:\nEmail: ${email}\nPassword: ${password}\n`);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

createAdmin();
