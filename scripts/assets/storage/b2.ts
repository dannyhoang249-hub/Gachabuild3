import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { assetsConfig } from '../config'

interface B2AuthResponse {
  authorizationToken: string
  apiUrl: string
  downloadUrl: string
}

interface B2UploadUrlResponse {
  uploadUrl: string
  authorizationToken: string
}

let authCache: { auth: B2AuthResponse; expires: number } | null = null

/**
 * Authorize with B2
 */
async function authorizeB2(): Promise<B2AuthResponse> {
  // Check cache
  if (authCache && authCache.expires > Date.now()) {
    return authCache.auth
  }
  
  const { b2 } = assetsConfig
  const credentials = Buffer.from(`${b2.applicationKeyId}:${b2.applicationKey}`).toString('base64')
  
  const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`B2 authorization failed: ${response.statusText}`)
  }
  
  const auth = await response.json() as B2AuthResponse
  
  // Cache for 23 hours (tokens last 24 hours)
  authCache = {
    auth,
    expires: Date.now() + 23 * 60 * 60 * 1000
  }
  
  return auth
}

/**
 * Get upload URL from B2
 */
async function getUploadUrl(): Promise<B2UploadUrlResponse> {
  const auth = await authorizeB2()
  const { b2 } = assetsConfig
  
  const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      'Authorization': auth.authorizationToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bucketId: b2.bucketId
    })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get B2 upload URL: ${response.statusText}`)
  }
  
  return await response.json() as B2UploadUrlResponse
}

/**
 * Upload file to B2
 */
export async function uploadToB2(
  localPath: string,
  remotePath: string,
  contentType?: string
): Promise<string> {
  const uploadUrl = await getUploadUrl()
  const { b2 } = assetsConfig
  
  // Read file
  const fileBuffer = await fs.readFile(localPath)
  
  // Calculate SHA1 hash
  const sha1 = crypto.createHash('sha1').update(fileBuffer).digest('hex')
  
  // Determine content type
  const ext = path.extname(localPath).toLowerCase()
  const mimeType = contentType || getMimeType(ext)
  
  // Upload
  const response = await fetch(uploadUrl.uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': uploadUrl.authorizationToken,
      'Content-Type': mimeType,
      'Content-Length': fileBuffer.length.toString(),
      'X-Bz-File-Name': remotePath,
      'X-Bz-Content-Sha1': sha1,
      'X-Bz-Info-b2-cache-control': 'public, max-age=31536000, immutable'
    },
    body: fileBuffer
  })
  
  if (!response.ok) {
    throw new Error(`B2 upload failed: ${response.statusText}`)
  }
  
  // Return public URL
  const publicUrl = b2.publicUrl || `${(await authorizeB2()).downloadUrl}/file/${b2.bucketName}`
  return `${publicUrl}/${remotePath}`
}

/**
 * Check if file exists in B2
 */
export async function checkB2FileExists(remotePath: string): Promise<boolean> {
  const { b2 } = assetsConfig
  const publicUrl = b2.publicUrl || `${(await authorizeB2()).downloadUrl}/file/${b2.bucketName}`
  const fileUrl = `${publicUrl}/${remotePath}`
  
  try {
    const response = await fetch(fileUrl, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    return false
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

