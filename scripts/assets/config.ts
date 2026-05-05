import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export const assetsConfig = {
  // Storage provider: 'r2' or 'b2'
  provider: (process.env.ASSET_STORAGE_PROVIDER || 'r2') as 'r2' | 'b2',
  
  // Cloudflare R2 configuration
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    bucketName: process.env.R2_BUCKET || 'gachabuild-assets',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    publicUrl: process.env.R2_PUBLIC_URL || '', // e.g., https://assets.example.com
    endpoint: process.env.R2_ENDPOINT || '' // e.g., https://<accountid>.r2.cloudflarestorage.com
  },
  
  // Backblaze B2 configuration
  b2: {
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID || '',
    applicationKey: process.env.B2_APPLICATION_KEY || '',
    bucketId: process.env.B2_BUCKET_ID || '',
    bucketName: process.env.B2_BUCKET_NAME || 'gachabuild-assets',
    publicUrl: process.env.B2_PUBLIC_URL || '' // e.g., https://f002.backblazeb2.com/file/bucket-name
  },
  
  // Upload settings
  maxConcurrent: parseInt(process.env.ASSET_MAX_CONCURRENT || '3', 10),
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
  
  // File paths
  tempDir: './scripts/assets/temp',
  
  // Sanity configuration
  sanityProjectId: process.env.SANITY_PROJECT_ID || '',
  sanityDataset: process.env.SANITY_DATASET || 'production',
  sanityToken: process.env.SANITY_TOKEN || '',
  sanityApiVersion: '2024-01-01'
}

// Validate configuration
export function validateConfig(): void {
  const { provider, r2, b2, sanityProjectId, sanityToken } = assetsConfig
  
  if (!sanityProjectId || !sanityToken) {
    throw new Error('Sanity configuration missing (SANITY_PROJECT_ID, SANITY_TOKEN)')
  }
  
  if (provider === 'r2') {
    if (!r2.accountId || !r2.accessKeyId || !r2.secretAccessKey || !r2.bucketName) {
      throw new Error('R2 configuration incomplete')
    }
  } else if (provider === 'b2') {
    if (!b2.applicationKeyId || !b2.applicationKey || !b2.bucketId || !b2.bucketName) {
      throw new Error('B2 configuration incomplete')
    }
  } else {
    throw new Error(`Unknown storage provider: ${provider}`)
  }
}

