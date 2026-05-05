import { assetsConfig } from '../config'
import { uploadToR2, checkR2FileExists } from './r2'
import { uploadToB2, checkB2FileExists } from './b2'

/**
 * Upload file to configured storage provider
 */
export async function uploadFile(
  localPath: string,
  remotePath: string,
  contentType?: string
): Promise<string> {
  const { provider } = assetsConfig
  
  if (provider === 'r2') {
    return uploadToR2(localPath, remotePath, contentType)
  } else if (provider === 'b2') {
    return uploadToB2(localPath, remotePath, contentType)
  } else {
    throw new Error(`Unknown storage provider: ${provider}`)
  }
}

/**
 * Check if file exists in configured storage
 */
export async function checkFileExists(remotePath: string): Promise<boolean> {
  const { provider } = assetsConfig
  
  if (provider === 'r2') {
    return checkR2FileExists(remotePath)
  } else if (provider === 'b2') {
    return checkB2FileExists(remotePath)
  } else {
    throw new Error(`Unknown storage provider: ${provider}`)
  }
}

/**
 * Generate remote path for asset
 */
export function generateRemotePath(
  docType: string,
  slug: string,
  assetType: string,
  filename: string
): string {
  const ext = filename.split('.').pop()
  return `${docType}/${slug}/${assetType}.${ext}`
}

