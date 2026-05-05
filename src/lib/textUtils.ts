/**
 * Text Utility Functions
 * Comprehensive text cleaning and sanitization for CMS content
 */

/**
 * Clean text by removing markdown artifacts and formatting
 * @param text - Raw text from CMS (can be string or multilingual object)
 * @returns Cleaned text without markdown symbols
 */
export function cleanText(text: string | undefined | null | any): string {
  if (!text) return '';

  // If text is an object (multilingual), return empty string
  // The caller should use t() function first to get the string
  if (typeof text !== 'string') {
    console.warn('cleanText received non-string value:', text);
    return '';
  }

  return text
    // Remove bold markers
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // Remove italic markers
    .replace(/\*(.+?)\*/g, '$1')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove brackets
    .replace(/\[([^\]]+)\]/g, '$1')
    // Remove parentheses (optional - be careful with this)
    // .replace(/\(([^)]+)\)/g, '')
    // Remove heading markers
    .replace(/^#+\s+/gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitize HTML content - allow only safe inline tags
 * @param html - HTML string
 * @returns Sanitized HTML
 */
export function sanitizeHTML(html: string | undefined | null): string {
  if (!html) return '';
  
  // List of allowed tags
  const allowedTags = ['strong', 'em', 'sup', 'sub', 'br'];
  
  // Remove all tags except allowed ones
  let sanitized = html;
  
  // First, protect allowed tags
  const protectedTags: { [key: string]: string } = {};
  allowedTags.forEach((tag, index) => {
    const placeholder = `__PROTECTED_TAG_${index}__`;
    const openRegex = new RegExp(`<${tag}>`, 'gi');
    const closeRegex = new RegExp(`</${tag}>`, 'gi');
    
    sanitized = sanitized.replace(openRegex, (match) => {
      const key = `${placeholder}_OPEN`;
      protectedTags[key] = match;
      return key;
    });
    
    sanitized = sanitized.replace(closeRegex, (match) => {
      const key = `${placeholder}_CLOSE`;
      protectedTags[key] = match;
      return key;
    });
  });
  
  // Remove all remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Restore protected tags
  Object.keys(protectedTags).forEach((key) => {
    sanitized = sanitized.replace(key, protectedTags[key]);
  });
  
  return sanitized.trim();
}

/**
 * Convert markdown to clean HTML
 * @param markdown - Markdown text
 * @returns Clean HTML
 */
export function markdownToHTML(markdown: string | undefined | null): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Convert bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html.trim();
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 120): string {
  if (!text || text.length <= maxLength) return text;
  
  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Replace ASCII quotes with typographic quotes
 * @param text - Text with ASCII quotes
 * @returns Text with typographic quotes
 */
export function typographicQuotes(text: string): string {
  if (!text) return '';

  return text
    // Replace double quotes
    .replace(/"([^"]*)"/g, '\u201C$1\u201D')
    // Replace single quotes
    .replace(/'([^']*)'/g, '\u2018$1\u2019');
}

/**
 * Format stat value for display
 * @param value - Stat value
 * @returns Formatted value or dash if empty
 */
export function formatStatValue(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '' || value === 'N/A') {
    return '—';
  }
  
  return String(value);
}

/**
 * Format stat range (Lv.1 → Lv.Max)
 * @param lv1 - Level 1 value
 * @param lvMax - Max level value
 * @returns Formatted range string
 */
export function formatStatRange(lv1: string | number, lvMax: string | number): string {
  const v1 = formatStatValue(lv1);
  const v2 = formatStatValue(lvMax);
  
  if (v1 === '—' && v2 === '—') return '—';
  if (v1 === v2) return v1;
  
  return `${v1} → ${v2}`;
}

/**
 * Extract one-line overview from longer text
 * @param text - Full text
 * @param maxLength - Maximum length (default 120)
 * @returns One-line overview
 */
export function extractOverview(text: string | undefined | null, maxLength: number = 120): string {
  if (!text) return '';
  
  // Clean the text first
  const cleaned = cleanText(text);
  
  // Get first sentence or truncate
  const firstSentence = cleaned.split(/[.!?]/)[0];
  
  if (firstSentence.length <= maxLength) {
    return firstSentence.trim();
  }
  
  return truncateText(cleaned, maxLength);
}

/**
 * Parse inline stats from description
 * Extracts stats like "DMG: 45%" from text
 * @param text - Text containing stats
 * @returns Array of stat objects
 */
export function parseInlineStats(text: string): Array<{ name: string; value: string }> {
  if (!text) return [];
  
  const stats: Array<{ name: string; value: string }> = [];
  
  // Match patterns like "Stat Name: Value" or "Stat: Value"
  const regex = /([A-Za-z\s]+):\s*([0-9.%→\-\s]+)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    stats.push({
      name: match[1].trim(),
      value: match[2].trim()
    });
  }
  
  return stats;
}

/**
 * Clean and format skill description
 * @param description - Raw skill description
 * @returns Cleaned description
 */
export function cleanSkillDescription(description: string | undefined | null): string {
  if (!description) return '';
  
  let cleaned = cleanText(description);
  cleaned = typographicQuotes(cleaned);
  
  return cleaned;
}

/**
 * Check if text contains markdown
 * @param text - Text to check
 * @returns True if markdown detected
 */
export function hasMarkdown(text: string): boolean {
  if (!text) return false;

  const markdownPatterns = [
    /\*\*.*?\*\*/,  // Bold
    /\*.*?\*/,      // Italic
    /\[.*?\]\(.*?\)/, // Links
    /^#+\s/m,       // Headings
    /```[\s\S]*?```/    // Code blocks (using [\s\S] instead of /s flag for ES2017 compatibility)
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
}

