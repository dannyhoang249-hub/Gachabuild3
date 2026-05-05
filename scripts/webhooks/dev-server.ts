#!/usr/bin/env node

/**
 * Development webhook server for testing Sanity webhooks locally
 * 
 * Usage: npm run sanity:webhooks:dev
 */

import http from 'http'
import { processSanityWebhook, verifyWebhookSignature, triggerBuildHook } from './sanity-webhook'

const PORT = parseInt(process.env.WEBHOOK_DEV_PORT || '3001', 10)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'dev-secret'

const server = http.createServer(async (req, res) => {
  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-webhook-signature')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Webhook dev server is running',
      port: PORT
    }))
    return
  }

  if (req.method === 'POST' && req.url === '/webhook') {
    let body = ''
    
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        // Verify signature if provided
        const signature = req.headers['x-webhook-signature'] as string
        if (signature) {
          const isValid = verifyWebhookSignature(body, signature, WEBHOOK_SECRET)
          if (!isValid) {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid signature' }))
            return
          }
        }

        const payload = JSON.parse(body)
        console.log('\n📨 Webhook received:', payload)

        // Determine action
        const action = payload._action || 'update'

        // Process webhook
        await processSanityWebhook(payload, action)

        // Optionally trigger build
        if (process.env.TRIGGER_BUILD === 'true') {
          await triggerBuildHook()
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: true,
          message: 'Webhook processed',
          payload
        }))

      } catch (error: any) {
        console.error('Webhook processing error:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: error.message
        }))
      }
    })

    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`\n🚀 Webhook dev server running on http://localhost:${PORT}`)
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`)
  console.log(`🔐 Webhook secret: ${WEBHOOK_SECRET}`)
  console.log('\nConfigure this URL in Sanity webhook settings for local testing\n')
})

