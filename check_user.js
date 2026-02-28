import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function main() {
    console.log(`Checking if user 'd.s.dhariwal@lse.ac.uk' exists by attempting login...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'd.s.dhariwal@lse.ac.uk',
        password: 'Dylan123',
    });

    if (error) {
        console.error("Failed to login:", error.message);
    } else {
        console.log("Login successful! User exists.");
    }
}

main();
