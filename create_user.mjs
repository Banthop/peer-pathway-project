import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing Supabase credentials in .env file");
    process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
    console.log(`Attempting to create user 'd.s.dhariwal@lse.ac.uk'...`);

    const { data, error } = await supabase.auth.signUp({
        email: 'd.s.dhariwal@lse.ac.uk',
        password: 'Dylan123',
        options: {
            data: {
                name: 'Dylan Dhariwal',
                type: 'student',
            }
        }
    });

    if (error) {
        console.error("Failed to create user:", error.message);
    } else {
        console.log("Successfully created user!");
        console.log("User ID:", data.user?.id);
    }
}

main();
