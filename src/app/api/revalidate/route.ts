import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''

interface RevalidatePayload {
  _type: string
  slug: string
  action: 'create' | 'update' | 'delete'
  localesChanged?: string[]
}

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret')
  return response
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function OPTIONS() {
  const response = NextResponse.json({ ok: true })
  return addCorsHeaders(response)
}

/**
 * Webhook endpoint for content revalidation
 * Called by Sanity webhooks or manual triggers
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (only if WEBHOOK_SECRET is set)
    const secret = request.headers.get('x-webhook-secret')
    if (WEBHOOK_SECRET && WEBHOOK_SECRET !== '' && secret !== WEBHOOK_SECRET) {
      console.error('❌ Webhook secret mismatch:', { expected: WEBHOOK_SECRET, received: secret })
      const response = NextResponse.json(
        { error: 'Unauthorized - Invalid webhook secret' },
        { status: 401 }
      )
      return addCorsHeaders(response)
    }

    const payload: RevalidatePayload = await request.json()
    const { _type, slug, action } = payload

    console.log('🔄 Revalidation request:', { _type, slug, action })
    console.log('📍 Request origin:', request.headers.get('origin'))
    console.log('🔑 Webhook secret verified:', secret === WEBHOOK_SECRET)



    // Determine paths to revalidate
    const pathsToRevalidate: string[] = []
    const locales = ['en', 'vi', 'jp', 'zh']

    if (_type === 'character') {
      // Revalidate character detail pages
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/characters/${slug}`)
      })
      
      // Revalidate character listing page
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/characters`)
      })
      
      // Revalidate home page if it shows characters
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}`)
      })
      
    } else if (_type === 'weapon') {
      // Revalidate weapon detail pages
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/weapon/${slug}`)
      })
      
      // Revalidate weapon listing page
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/weapons`)
      })
      
    } else if (_type === 'guide') {
      // Revalidate guide pages
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/guides/${slug}`)
      })
      
      locales.forEach(locale => {
        pathsToRevalidate.push(`/${locale}/guides`)
      })
    }

    // Execute revalidation
    const results = []
    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path)
        results.push({ path, status: 'success' })

      } catch (error: any) {
        results.push({ path, status: 'error', error: error.message })

      }
    }

    // Also revalidate by tags if using tag-based revalidation
    try {
      revalidateTag(_type)
      revalidateTag(`${_type}-${slug}`)
    } catch (error) {
      // Tag revalidation failed - continue silently
    }

    const response = NextResponse.json({
      success: true,
      message: `Revalidated ${pathsToRevalidate.length} paths`,
      results,
      timestamp: new Date().toISOString()
    })
    return addCorsHeaders(response)

  } catch (error: any) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
    return addCorsHeaders(response)
  }
}

/**
 * GET endpoint to check webhook status
 */
export async function GET() {
  const response = NextResponse.json({
    status: 'ok',
    message: 'Revalidation webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
  return addCorsHeaders(response)
}

