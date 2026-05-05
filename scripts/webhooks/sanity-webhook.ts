#!/usr/bin/env node

/**
 * Sanity Webhook Handler
 * 
 * This script handles incoming webhooks from Sanity and triggers
 * site revalidation or rebuild based on content changes.
 * 
 * Usage:
 * - Configure this URL as a webhook in Sanity settings
 * - Set WEBHOOK_SECRET in environment variables
 */

import crypto from 'crypto'

interface SanityWebhookPayload {
  _id: string
  _type: string
  slug?: { current: string }
  translationHash?: string
  autoTranslatedLocales?: string[]
}

/**
 * Verify Sanity webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return hash === signature
}

/**
 * Process Sanity webhook
 */
export async function processSanityWebhook(
  payload: SanityWebhookPayload,
  action: 'create' | 'update' | 'delete'
): Promise<void> {
  const { _type, slug, translationHash } = payload
  
  // Determine if revalidation is needed
  const needsRevalidation = 
    action === 'delete' || 
    translationHash !== undefined ||
    action === 'create'
  
  if (!needsRevalidation) {
    console.log('No revalidation needed')
    return
  }

  const slugValue = slug?.current
  if (!slugValue) {
    console.warn('Document has no slug, skipping revalidation')
    return
  }

  // Call revalidation endpoint
  const revalidateUrl = process.env.NEXT_REVALIDATE_URL || 'http://localhost:3000/api/revalidate'
  
  const response = await fetch(revalidateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': process.env.WEBHOOK_SECRET || ''
    },
    body: JSON.stringify({
      _type,
      slug: slugValue,
      action,
      localesChanged: payload.autoTranslatedLocales
    })
  })

  if (!response.ok) {
    throw new Error(`Revalidation failed: ${response.statusText}`)
  }

  const result = await response.json()
  console.log('Revalidation result:', result)
}

/**
 * Trigger external build hook (Netlify, Vercel, etc.)
 */
export async function triggerBuildHook(): Promise<void> {
  const buildHookUrl = process.env.NEXT_BUILD_HOOK
  
  if (!buildHookUrl) {
    console.log('No build hook configured, skipping build trigger')
    return
  }

  console.log('Triggering build hook...')
  
  const response = await fetch(buildHookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Build hook failed: ${response.statusText}`)
  }

  console.log('Build triggered successfully')
}

