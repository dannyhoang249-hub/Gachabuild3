import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { assetsConfig } from '../config'

/**
 * Download file from URL to local temp directory
 */
export async function downloadFile(url: string, filename: string): Promise<string> {
  const tempDir = assetsConfig.tempDir
  await fs.mkdir(tempDir, { recursive: true })
  
  const localPath = path.join(tempDir, filename)
  
  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), assetsConfig.timeout)

  const response = await fetch(url, {
    signal: controller.signal
  })

  clearTimeout(timeoutId)
  
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`)
  }
  
  if (!response.body) {
    throw new Error('Response body is null')
  }
  
  await pipeline(response.body, createWriteStream(localPath))
  
  return localPath
}

/**
 * Download Sanity asset
 */
export async function downloadSanityAsset(assetRef: any): Promise<string> {
  if (!assetRef || !assetRef.asset || !assetRef.asset._ref) {
    throw new Error('Invalid asset reference')
  }
  
  // Parse asset ID
  const assetId = assetRef.asset._ref
  const [, id, extension] = assetId.match(/image-([a-f0-9]+)-(\w+)/) || []
  
  if (!id || !extension) {
    throw new Error(`Could not parse asset ID: ${assetId}`)
  }
  
  // Construct Sanity CDN URL
  const { sanityProjectId, sanityDataset } = assetsConfig
  const url = `https://cdn.sanity.io/images/${sanityProjectId}/${sanityDataset}/${id}.${extension}`
  
  // Download
  const filename = `${id}.${extension}`
  return downloadFile(url, filename)
}

/**
 * Clean up temp directory
 */
export async function cleanupTemp(): Promise<void> {
  try {
    const files = await fs.readdir(assetsConfig.tempDir)
    for (const file of files) {
      await fs.unlink(path.join(assetsConfig.tempDir, file))
    }
  } catch (error) {
    // Directory might not exist
  }
}

