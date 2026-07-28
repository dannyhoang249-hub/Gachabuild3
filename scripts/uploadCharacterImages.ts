#!/usr/bin/env node

/**
 * Upload Character Images to Sanity
 * 
 * This script uploads character portrait images from data/game-content/PNG
 * to Sanity CMS and associates them with the corresponding character documents.
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: 'u9m27k7u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skDcoIdy72AGDXfWwhswUjKYWTAV8VLCs2GBpOpzfKz8BlgwweTJXSNkn15Qy3RElkLK0uIeQeFMFgDRNyVx2Q6dC8eSZByjmRV7TVBLxYVsJN5CMB7GVNeUIlRt7mkMEoWtLeQQcyi72QFdqdUliD9SXVXRpJTL60Dpauk4LzGoapbBKt9E',
  useCdn: false,
});

interface Stats {
  processed: number;
  uploaded: number;
  skipped: number;
  errors: number;
}

// Slug mapping for special cases
const SLUG_MAPPING: Record<string, string> = {
  'player.png': 'protagonist',
  'outsider.png': 'protagonist', // Alternative name
  'trufle-filbert.png': 'truffle-and-filbert',
  'yale-oliver.png': 'yale-and-oliver',
};

/**
 * Get character slug from filename
 */
function getSlugFromFilename(filename: string): string {
  const nameWithoutExt = filename.replace('.png', '');
  
  // Check if there's a special mapping
  if (SLUG_MAPPING[filename]) {
    return SLUG_MAPPING[filename];
  }
  
  // Convert to slug format (lowercase, replace spaces with hyphens)
  return nameWithoutExt.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Upload image to Sanity
 */
async function uploadImage(filePath: string, filename: string): Promise<any> {
  const imageBuffer = fs.readFileSync(filePath);
  
  const asset = await client.assets.upload('image', imageBuffer, {
    filename: filename,
    contentType: 'image/png',
  });
  
  return asset;
}

/**
 * Process a single character image
 */
async function processCharacterImage(
  filename: string,
  imagesDir: string,
  stats: Stats
): Promise<void> {
  try {
    const slug = getSlugFromFilename(filename);
    console.log(`\n📄 Processing: ${filename} → ${slug}`);
    
    // Find character by slug
    const characters = await client.fetch(
      `*[_type == "character" && slug.current == $slug]`,
      { slug }
    );
    
    if (characters.length === 0) {
      console.log(`   ⚠️  Character not found with slug: ${slug}`);
      stats.skipped++;
      stats.processed++;
      return;
    }
    
    const character = characters[0];
    
    // Check if character already has an image
    if (character.image?.asset?._ref) {
      console.log(`   ⏭️  Character already has an image, skipping`);
      stats.skipped++;
      stats.processed++;
      return;
    }
    
    // Upload image
    console.log(`   📤 Uploading image...`);
    const filePath = path.join(imagesDir, filename);
    const asset = await uploadImage(filePath, filename);
    
    // Update character with image reference
    await client
      .patch(character._id)
      .set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
          alt: `${character.name?.en || slug} portrait`,
        },
      })
      .commit();
    
    console.log(`   ✅ Image uploaded and linked successfully`);
    stats.uploaded++;
    stats.processed++;
    
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    stats.errors++;
    stats.processed++;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Starting character image upload...\n');
  
  const stats: Stats = {
    processed: 0,
    uploaded: 0,
    skipped: 0,
    errors: 0,
  };
  
  try {
    // Get images directory
    const imagesDir = path.join(__dirname, '../data/game-content/PNG');
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      console.error(`❌ Images directory not found: ${imagesDir}`);
      process.exit(1);
    }
    
    // Get all PNG files
    const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
    
    console.log(`Found ${files.length} image files\n`);
    
    // Process each image
    for (const filename of files) {
      await processCharacterImage(filename, imagesDir, stats);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log('   Processed:', stats.processed);
    console.log('   ✅ Uploaded:', stats.uploaded);
    console.log('   ⏭️  Skipped:', stats.skipped);
    console.log('   ❌ Errors:', stats.errors);
    console.log('='.repeat(50));
    
    if (stats.uploaded > 0) {
      console.log('\n✅ Image upload complete!');
      console.log('You can view the images in Sanity Studio at: http://localhost:3333');
    }
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

