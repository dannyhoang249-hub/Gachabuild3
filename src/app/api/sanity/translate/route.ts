import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN || '',
  apiVersion: '2024-01-01',
  useCdn: false
})

/**
 * API endpoint to trigger translation for a document
 * Called by Sanity Studio document actions
 */
export async function POST(request: NextRequest) {
  try {
    const { documentId, documentType } = await request.json()

    if (!documentId || !documentType) {
      return NextResponse.json(
        { error: 'Missing documentId or documentType' },
        { status: 400 }
      )
    }

    // Note: In production, you would call your translation script here
    // For now, this is a placeholder that returns a task ID
    // The actual translation should be done by a background job



    return NextResponse.json({
      success: true,
      message: 'Translation job queued',
      documentId,
      documentType,
      note: 'Run: npm run translate:run -- --id=' + documentId
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

