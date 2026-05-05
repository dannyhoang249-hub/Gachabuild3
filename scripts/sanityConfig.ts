import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate required environment variables
const requiredEnvVars = ['SANITY_PROJECT_ID', 'SANITY_DATASET', 'SANITY_API_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these in your .env.local file or environment');
  process.exit(1);
}

// Create Sanity client
export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false, // Use the API directly for mutations
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
});

// Helper function to create document ID
export const createDocumentId = (type: string, slug: string): string => {
  return `${type}.${slug}`;
};

// Helper function to log progress
export const logProgress = (current: number, total: number, itemName: string) => {
  const percentage = Math.round((current / total) * 100);
  console.log(`📊 Progress: ${current}/${total} (${percentage}%) - Processing: ${itemName}`);
};

// Helper function to handle errors
export const handleError = (error: any, itemName: string) => {
  console.error(`❌ Error processing ${itemName}:`, error.message || error);
  return false;
};
