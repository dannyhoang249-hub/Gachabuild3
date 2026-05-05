'use client'

import { useEffect } from 'react'

export default function HydrationFix() {
  useEffect(() => {
    const attributesToRemove = [
      'bis_skin_checked', 
      'data-bis-skinned', 
      'autofilled', 
      'data-bis-ignore',
      'data-bis-modified'
    ]
    
    const cleanupAttributes = () => {
      document.querySelectorAll('*').forEach(element => {
        attributesToRemove.forEach(attr => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr)
          }
        })
      })
    }
    
    // Run cleanup immediately
    cleanupAttributes()
    
    // Run cleanup after a short delay to catch any late-arriving attributes
    const timeouts = [
      setTimeout(cleanupAttributes, 100),
      setTimeout(cleanupAttributes, 500),
      setTimeout(cleanupAttributes, 1000),
      setTimeout(cleanupAttributes, 2000)
    ]
    
    // Set up mutation observer
    let observer: MutationObserver | null = null
    
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        let shouldCleanup = false
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes') {
            const attrName = mutation.attributeName
            if (attributesToRemove.includes(attrName || '')) {
              shouldCleanup = true
            }
          }
        })
        if (shouldCleanup) {
          cleanupAttributes()
        }
      })
      
      observer.observe(document.body, { 
        attributes: true, 
        subtree: true, 
        attributeFilter: attributesToRemove
      })
    }
    
    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])
  
  return null
}
