import { DocumentActionComponent, useDocumentOperation } from 'sanity'
import { useState, useCallback } from 'react'

export const MarkReviewedAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props
  const { patch } = useDocumentOperation(id, type)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMarkReviewed = useCallback(async () => {
    const doc = draft || published
    if (!doc) return

    // Prompt for locale selection
    const locale = prompt('Enter locale to mark as reviewed (vi, jp, or zh):')
    if (!locale || !['vi', 'jp', 'zh'].includes(locale)) {
      alert('Invalid locale. Please enter vi, jp, or zh.')
      return
    }

    setIsProcessing(true)

    try {
      const autoTranslated = doc.autoTranslatedLocales || []
      const readyLocales = doc.i18nReadyLocales || []

      // Remove from auto-translated and add to ready
      const newAutoTranslated = Array.isArray(autoTranslated) ? autoTranslated.filter((l: string) => l !== locale) : []
      const newReadyLocales = Array.from(new Set([...(Array.isArray(readyLocales) ? readyLocales : []), locale]))

      patch.execute([
        {
          set: {
            autoTranslatedLocales: newAutoTranslated,
            i18nReadyLocales: newReadyLocales
          }
        }
      ])

      alert(`Locale "${locale}" marked as reviewed!`)
    } catch (error: any) {
      console.error('Mark reviewed error:', error)
      alert(`Failed to mark as reviewed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }, [id, type, draft, published, patch])

  return {
    label: isProcessing ? 'Processing...' : 'Mark Locale Reviewed',
    icon: () => '✓',
    disabled: isProcessing || (!published && !draft),
    onHandle: handleMarkReviewed
  }
}

