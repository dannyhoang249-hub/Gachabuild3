# i18n Translation System

This document describes the internationalization (i18n) system for duetnightabyss.gachabuild.com.

## Overview

The i18n system supports four locales:
- **en** (English) - Source locale
- **vi** (Vietnamese)
- **jp** (Japanese)
- **zh** (Chinese Simplified)

## Architecture

### 1. Sanity Schema Extensions

All content types (character, weapon, guide) have been extended with:

**Localized Fields:**
- `name: { en, vi, jp, zh }`
- `overview/description: { en, vi, jp, zh }`
- `skills[].name: { en, vi, jp, zh }`
- `skills[].description: { en, vi, jp, zh }`
- `pros/cons: [{ en, vi, jp, zh }]`

**Metadata Fields:**
- `i18nReadyLocales: string[]` - Locales verified by editors
- `autoTranslatedLocales: string[]` - Locales filled by AI, pending review
- `translationHash: string` - SHA-256 hash for change detection

### 2. Translation Pipeline

```
English Content (source)
    ↓
Hash Calculation
    ↓
Translation Service (OpenAI/DeepL)
    ↓
Glossary Application
    ↓
Cache Storage
    ↓
Sanity Update
    ↓
Webhook Trigger → Site Revalidation
```

## Setup

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Translation Service
TRANSLATION_SERVICE=openai  # or 'deepl'
OPENAI_API_KEY=sk-...
TRANSLATE_LANGS=vi,jp,zh
RATE_LIMIT=10  # requests per minute

# Sanity
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_TOKEN=...  # needs write access
```

### Install Dependencies

```bash
npm install
```

## Usage

### Running Translations

**Full Translation (All Documents):**
```bash
npm run translate:run
```

**Dry Run (Preview Only):**
```bash
npm run translate:dry
```

**Translate Specific Type:**
```bash
npm run translate:run -- --type=character
```

**Translate Specific Document:**
```bash
npm run translate:run -- --id=character-123
```

**Force Re-translate:**
```bash
npm run translate:force
```

### Glossary Management

Edit `scripts/i18n/glossary.json` to manage terminology:

```json
{
  "terms": {
    "Vanguard": {
      "vi": "Tiên Phong",
      "jp": "ヴァンガード",
      "zh": "先锋"
    }
  },
  "preservePatterns": [
    "\\d+%",
    "\\d+s",
    "Lv\\."
  ]
}
```

**Rules:**
- Terms are case-insensitive and match whole words
- Preserve patterns protect numbers, percentages, and special formats
- Glossary is applied before and after AI translation

### Translation Workflow

1. **Content Creation:**
   - Create content in English (source locale)
   - Publish in Sanity

2. **Auto-Translation:**
   ```bash
   npm run translate:run
   ```
   - Translates missing locales
   - Marks as `autoTranslatedLocales`
   - Updates `translationHash`

3. **Review & Verification:**
   - In Sanity Studio, use document action: "Mark Locale Reviewed"
   - Moves locale from `autoTranslatedLocales` to `i18nReadyLocales`

4. **Content Updates:**
   - When English content changes, hash changes
   - Re-run translation to update affected locales
   - Previous translations preserved if source unchanged

## Translation Hashing

The system uses SHA-256 hashing to detect content changes:

```typescript
// Content extracted for hashing
{
  name: "Character Name",
  overview: "Description...",
  skills: [...],
  pros: [...],
  cons: [...]
}
```

**Hash is recalculated when:**
- English content changes
- Translation job runs
- Manual force update

## Caching

Translations are cached to avoid re-translating identical content:

**Cache Location:** `scripts/i18n/cache/`

**Cache TTL:** 30 days

**Clear Old Cache:**
```bash
# Automatically cleared on translation runs
# Or manually delete: rm -rf scripts/i18n/cache/*.json
```

## Rate Limiting

Built-in rate limiting prevents API quota exhaustion:

- **Default:** 10 requests per minute
- **Retry Logic:** Exponential backoff (3 attempts)
- **Configurable:** Set `RATE_LIMIT` env var

## Cost Control

**Best Practices:**

1. **Use Dry Run First:**
   ```bash
   npm run translate:dry
   ```

2. **Translate Incrementally:**
   ```bash
   npm run translate:run -- --type=character
   ```

3. **Leverage Cache:**
   - Cache reduces duplicate translations
   - Don't clear cache unless necessary

4. **Edit Glossary:**
   - Add common terms to reduce AI token usage
   - More accurate translations

5. **Monitor Usage:**
   - OpenAI: Check dashboard.openai.com
   - DeepL: Check www.deepl.com/account

## Frontend Integration

### Using Translations in Components

```tsx
import { getLocalizedContent, getLocalizedArray } from '@/lib/i18n'

export default async function CharacterPage({ params }) {
  const character = await getCharacter(params.slug)
  const locale = params.locale // from route: /[locale]/characters/[slug]
  
  const name = getLocalizedContent(character.name, locale)
  const overview = getLocalizedContent(character.overview, locale)
  const pros = getLocalizedArray(character.pros, locale)
  
  return (
    <div>
      <h1>{name}</h1>
      <p>{overview}</p>
      <ul>
        {pros.map((pro, i) => <li key={i}>{pro}</li>)}
      </ul>
    </div>
  )
}
```

### Locale Switcher

```tsx
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <LocaleSwitcher />
      </nav>
      {children}
    </div>
  )
}
```

### Translation Status Badge

```tsx
import { TranslationStatus } from '@/components/TranslationStatus'

<TranslationStatus document={character} locale={locale} />
// Shows: "Verified Translation" or "Auto-Translated"
```

## Sanity Studio Actions

### Translate Missing Locales

1. Open document in Sanity Studio
2. Click "Translate Missing Locales" button
3. Triggers translation job via API

### Mark Locale Reviewed

1. Open document in Sanity Studio
2. Click "Mark Locale Reviewed"
3. Enter locale code (vi, jp, zh)
4. Moves from auto-translated to verified

## Troubleshooting

### Translations Not Working

**Check:**
1. API key is valid: `echo $OPENAI_API_KEY`
2. Sanity token has write access
3. Run with verbose logging: `npm run translate:run`

### Rate Limit Errors

**Solution:**
- Increase `RATE_LIMIT` delay
- Use smaller batches: `--type=character`
- Wait and retry

### Glossary Not Applied

**Verify:**
1. JSON syntax is valid
2. Terms use exact capitalization
3. Clear cache and re-run

### Hash Mismatch

**Fix:**
```bash
npm run translate:force
```
This recalculates all hashes and re-translates if needed.

## Migration from Old System

If you have existing Vietnamese translations in the old format:

```bash
# The old format was: { en, vi }
# The new format is: { en, vi, jp, zh }
# Your existing vi translations are preserved
# Just run translate to add jp and zh
npm run translate:run
```

## API Reference

### Translation Service

```typescript
import { translate } from './scripts/i18n/translators'

const translation = await translate(
  'Hello World',
  'vi',
  { context: 'Greeting', useCache: true }
)
```

### Hash Utilities

```typescript
import { generateHash, hasContentChanged } from './scripts/i18n/utils/hash'

const hash = generateHash(content)
const changed = hasContentChanged(doc, 'character')
```

### Glossary Utilities

```typescript
import { loadGlossary, applyGlossary } from './scripts/i18n/utils/glossary'

const glossary = await loadGlossary()
const translated = applyGlossary(text, 'vi', glossary)
```

## Advanced Configuration

### Custom Translation Service

Implement `scripts/i18n/translators/custom.ts`:

```typescript
export async function translateWithCustom(
  text: string,
  targetLocale: string,
  options: TranslateOptions
): Promise<string> {
  // Your implementation
}
```

Update `scripts/i18n/config.ts`:
```typescript
translationService: 'custom'
```

### Webhook Integration

See [Webhook Documentation](./webhooks/README.md) for triggering builds on translation updates.

## Performance

**Benchmarks (Typical):**
- Character translation: ~30 seconds (all 3 locales)
- Weapon translation: ~15 seconds (all 3 locales)
- Cache hit: <100ms
- Rate limit delay: 6 seconds per request at default settings

**Optimization Tips:**
- Use batch processing for large updates
- Run during off-peak hours
- Leverage caching aggressively
- Use incremental updates (--type flag)

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Open GitHub issue with details

