import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs/promises'
import path from 'path'
import { assetsConfig } from '../config'

let s3Client: S3Client | null = null

/**
 * Initialize R2 client
 */
function getR2Client(): S3Client {
  if (s3Client) return s3Client
  
  const { r2 } = assetsConfig
  
  s3Client = new S3Client({
    region: 'auto',
    endpoint: r2.endpoint || `https://${r2.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey
    }
  })
  
  return s3Client
}

/**
 * Upload file to R2
 */
export async function uploadToR2(
  localPath: string,
  remotePath: string,
  contentType?: string
): Promise<string> {
  const client = getR2Client()
  const { r2 } = assetsConfig
  
  // Read file
  const fileBuffer = await fs.readFile(localPath)
  
  // Determine content type
  const ext = path.extname(localPath).toLowerCase()
  const mimeType = contentType || getMimeType(ext)
  
  // Upload
  const command = new PutObjectCommand({
    Bucket: r2.bucketName,
    Key: remotePath,
    Body: fileBuffer,
    ContentType: mimeType,
    CacheControl: 'public, max-age=31536000, immutable'
  })
  
  await client.send(command)
  
  // Return public URL
  const publicUrl = r2.publicUrl || `${r2.endpoint}/${r2.bucketName}`
  return `${publicUrl}/${remotePath}`
}

/**
 * Check if file exists in R2
 */
export async function checkR2FileExists(remotePath: string): Promise<boolean> {
  const client = getR2Client()
  const { r2 } = assetsConfig
  
  try {
    const command = new HeadObjectCommand({
      Bucket: r2.bucketName,
      Key: remotePath
    })
    
    await client.send(command)
    return true
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false
    }
    throw error
  }
}

/**
 * Get MIME type from extension
 */
function getMimeType(ext: string): string {
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif'
  }
  
  return types[ext] || 'application/octet-stream'
}

