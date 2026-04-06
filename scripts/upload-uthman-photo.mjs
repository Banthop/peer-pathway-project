/**
 * Upload Uthman's profile photo to Supabase Storage
 * 
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-uthman-photo.mjs
 * 
 * This script:
 * 1. Creates a public 'assets' bucket if it doesn't exist
 * 2. Uploads the profile photo from public/images/uthman-profile.jpg
 * 3. Outputs the public URL to use in the code
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://cidnbhphbmwvbozdxqhe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  console.error('   Find it in: Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  // 1. Create bucket if needed
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === 'assets');
  
  if (!exists) {
    console.log('📦 Creating "assets" bucket...');
    const { error } = await supabase.storage.createBucket('assets', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (error) {
      console.error('❌ Failed to create bucket:', error.message);
      process.exit(1);
    }
    console.log('✅ Bucket created');
  } else {
    console.log('✅ Bucket "assets" already exists');
  }

  // 2. Upload the image
  const imagePath = join(__dirname, '..', 'public', 'images', 'uthman-profile.jpg');
  let imageBuffer;
  try {
    imageBuffer = readFileSync(imagePath);
  } catch {
    console.error(`❌ Could not read image at: ${imagePath}`);
    console.error('   Make sure the profile photo is saved there first.');
    process.exit(1);
  }

  console.log('📤 Uploading profile photo...');
  const { error: uploadError } = await supabase.storage
    .from('assets')
    .upload('uthman-profile.jpg', imageBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message);
    process.exit(1);
  }

  // 3. Get public URL
  const { data: urlData } = supabase.storage
    .from('assets')
    .getPublicUrl('uthman-profile.jpg');

  console.log('✅ Upload complete!');
  console.log(`🔗 Public URL: ${urlData.publicUrl}`);
  console.log('\nUpdate UTHMAN_PHOTO_URL in BookUthman.tsx to this URL.');
}

main().catch(console.error);
