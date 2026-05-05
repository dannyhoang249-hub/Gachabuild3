import crypto from 'crypto'

/**
 * Generate a hash from content for change detection
 */
export function generateHash(content: any): string {
  const normalized = JSON.stringify(content, Object.keys(content).sort())
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16)
}

/**
 * Extract translatable content from a document
 */
export function extractTranslatableContent(doc: any, docType: string): any {
  const content: any = {}
  
  if (docType === 'character') {
    if (doc.name?.en) content.name = doc.name.en
    if (doc.overview?.en) content.overview = doc.overview.en
    if (doc.skills) {
      content.skills = doc.skills.map((skill: any) => ({
        name: skill.name?.en || '',
        description: skill.description?.en || ''
      }))
    }
    if (doc.pros) {
      content.pros = doc.pros.map((p: any) => p.en || '').filter(Boolean)
    }
    if (doc.cons) {
      content.cons = doc.cons.map((c: any) => c.en || '').filter(Boolean)
    }
    if (doc.synergy) {
      content.synergy = doc.synergy.map((s: any) => s.reason?.en || '').filter(Boolean)
    }
  } else if (docType === 'weapon') {
    if (doc.name?.en) content.name = doc.name.en
    if (doc.description?.en) content.description = doc.description.en
    if (doc.passive?.en) content.passive = doc.passive.en
  } else if (docType === 'guide') {
    if (doc.title?.en) content.title = doc.title.en
    if (doc.summary?.en) content.summary = doc.summary.en
    // Note: content.en is block content, we'll handle it separately
    if (doc.content?.en) content.content = 'has_block_content'
  }
  
  return content
}

/**
 * Check if content has changed based on hash
 */
export function hasContentChanged(doc: any, docType: string): boolean {
  const currentContent = extractTranslatableContent(doc, docType)
  const currentHash = generateHash(currentContent)
  return doc.translationHash !== currentHash
}

