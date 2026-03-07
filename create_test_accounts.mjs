import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env.local manually
const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_ANON_KEY'];

if (!url || !key) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(url, key);

async function createAccount(email, password, name, type) {
    console.log(`\nCreating ${type} account: ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, type }
        }
    });

    if (error) {
        console.error(`  ❌ Failed: ${error.message}`);
        return null;
    }

    console.log(`  ✅ Created! User ID: ${data.user?.id}`);
    console.log(`  📧 Email: ${email}`);
    console.log(`  🔑 Password: ${password}`);
    console.log(`  👤 Type: ${type}`);
    return data.user;
}

async function main() {
    console.log("=== Creating EarlyEdge Test Accounts ===\n");

    // Create student account
    await createAccount(
        'student@earlyedge.co.uk',
        'Student123!',
        'Test Student',
        'student'
    );

    // Create coach account
    await createAccount(
        'coach@earlyedge.co.uk',
        'Coach123!',
        'Test Coach',
        'coach'
    );

    console.log("\n=== Done! ===");
    console.log("\nStudent login: student@earlyedge.co.uk / Student123!");
    console.log("Coach login:   coach@earlyedge.co.uk / Coach123!");
}

main();
