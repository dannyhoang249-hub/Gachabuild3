import { DocumentActionComponent } from 'sanity'
import { useState, useCallback } from 'react'

export const RevalidateAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props
  const [isRevalidating, setIsRevalidating] = useState(false)

  const handleRevalidate = useCallback(async () => {
    const doc = draft || published
    if (!doc) return

    setIsRevalidating(true)

    try {
      // Extract slug for revalidation
      const slug = (doc.slug as any)?.current
      if (!slug) {
        throw new Error('Document has no slug')
      }

      // Determine the webhook URL
      // In production (VPS), use the full URL
      // In development, use relative path
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      const webhookUrl = isProduction
        ? 'https://duetnightabyss.gachabuild.com/api/revalidate'
        : '/api/revalidate'

      console.log('🚀 Revalidating:', { type, slug, webhookUrl })

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Use a simple secret or omit if not configured
          'x-webhook-secret': 'gachabuild-revalidate-2025'
        },
        body: JSON.stringify({
          _type: type,
          slug: slug,
          action: 'update'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Revalidation failed:', errorText)
        throw new Error(`Revalidation failed: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ Revalidation result:', result)

      alert(`✅ Site revalidation triggered successfully!\n\nRevalidated ${result.results?.length || 0} paths`)

    } catch (error: any) {
      console.error('Revalidation error:', error)
      alert(`❌ Revalidation failed: ${error.message}\n\nPlease check the console for details.`)
    } finally {
      setIsRevalidating(false)
    }
  }, [id, type, draft, published])

  return {
    label: isRevalidating ? 'Revalidating...' : 'Push Build / Revalidate',
    icon: () => '🚀',
    disabled: isRevalidating || (!published && !draft),
    onHandle: handleRevalidate
  }
}

