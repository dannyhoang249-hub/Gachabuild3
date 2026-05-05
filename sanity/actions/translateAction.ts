import { DocumentActionComponent, useDocumentOperation } from 'sanity'
import { useState, useCallback } from 'react'

export const TranslateAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props
  const { patch } = useDocumentOperation(id, type)
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = useCallback(async () => {
    if (!published && !draft) return

    setIsTranslating(true)
    
    try {
      // Call the translation API endpoint
      const response = await fetch('/api/sanity/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId: id,
          documentType: type
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result = await response.json()
      
      // Refresh the document to show translations
      window.location.reload()
      
    } catch (error: any) {
      console.error('Translation error:', error)
      alert(`Translation failed: ${error.message}`)
    } finally {
      setIsTranslating(false)
    }
  }, [id, type, published, draft])

  return {
    label: isTranslating ? 'Translating...' : 'Translate Missing Locales',
    icon: () => '🌐',
    disabled: isTranslating || (!published && !draft),
    onHandle: handleTranslate
  }
}

