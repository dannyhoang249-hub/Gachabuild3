# Production i18n & Asset Storage System

**Complete internationalization and hybrid asset storage for duetnightabyss.gachabuild.com**

## 🌟 Features

### ✅ Internationalization (i18n)
- **4 Locales**: English (en), Vietnamese (vi), Japanese (jp), Chinese (zh)
- **AI Translation**: OpenAI GPT-4 or DeepL integration
- **Smart Caching**: 30-day cache to reduce API costs
- **Glossary System**: Consistent terminology across translations
- **Change Detection**: SHA-256 hashing to track content updates
- **Rate Limiting**: Built-in controls with exponential backoff
- **Quality Tracking**: Distinguish auto-translated vs. verified content

### ✅ Hybrid Asset Storage
- **CDN Storage**: Cloudflare R2 or Backblaze B2
- **Cost Effective**: Reduce Sanity storage costs
- **Fast Delivery**: Global CDN distribution
- **Migration Tools**: Batch migrate existing assets
- **Resumable**: Idempotent operations, safe to retry
- **Fallback Support**: Graceful degradation to Sanity assets

### ✅ Webhook System
- **Auto-Revalidation**: Trigger Next.js ISR on content changes
- **Build Hooks**: Optional full rebuild support
- **Secure**: HMAC signature verification
- **Flexible**: Support for Netlify, Vercel, or custom VPS

### ✅ Sanity Studio Integration
- **Document Actions**: 
  - 🌐 Translate Missing Locales
  - ✓ Mark Locale Reviewed
  - 🚀 Push Build / Revalidate
- **Extended Schemas**: Non-breaking additions to character, weapon, guide
- **Metadata Tracking**: Translation status and attribution

## 📁 Project Structure

```
gachabuild2-main/
├── sanity/
│   ├── schemas/
│   │   ├── character.ts       # Extended with i18n + CDN fields
│   │   ├── weapon.ts          # Extended with i18n + CDN fields
│   │   ├── guide.ts           # New schema with i18n + CDN fields
│   │   └── index.ts
│   └── actions/
│       ├── translateAction.ts
│       ├── markReviewedAction.ts
│       ├── revalidateAction.ts
│       └── index.ts
├── scripts/
│   ├── i18n/
│   │   ├── config.ts          # i18n configuration
│   │   ├── glossary.json      # Translation glossary
│   │   ├── translate.ts       # Main translation script
│   │   ├── translators/
│   │   │   ├── openai.ts
│   │   │   ├── deepl.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── cache.ts
│   │       ├── hash.ts
│   │       ├── glossary.ts
│   │       └── rateLimit.ts
│   ├── assets/
│   │   ├── config.ts          # Asset storage configuration
│   │   ├── upload.ts          # Single file upload
│   │   ├── migrate.ts         # Batch migration
│   │   ├── storage/
│   │   │   ├── r2.ts
│   │   │   ├── b2.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── download.ts
│   └── webhooks/
│       ├── sanity-webhook.ts
│       ├── dev-server.ts
│       └── README.md
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── revalidate/
│   │       │   └── route.ts   # ISR revalidation endpoint
│   │       └── sanity/
│   │           └── translate/
│   │               └── route.ts
│   ├── lib/
│   │   └── i18n/
│   │       ├── types.ts
│   │       ├── utils.ts
│   │       ├── hooks.tsx
│   │       └── index.ts
│   └── components/
│       ├── LocaleSwitcher.tsx
│       └── TranslationStatus.tsx
└── docs/
    ├── i18n-system.md         # Detailed i18n docs
    ├── asset-storage.md       # Detailed asset docs
    └── SETUP_GUIDE.md         # Complete setup guide
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` with:
```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
SANITY_TOKEN=your-write-token

# Translation
TRANSLATION_SERVICE=openai
OPENAI_API_KEY=sk-...

# Assets
ASSET_STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=...
R2_BUCKET=gachabuild-assets
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...

# Webhooks
WEBHOOK_SECRET=your-secret
```

### 3. Run Translation
```bash
# Dry run first
npm run translate:dry

# Actual translation
npm run translate:run
```

### 4. Migrate Assets
```bash
# Dry run first
npm run assets:migrate:dry

# Actual migration
npm run assets:migrate
```

## 📖 Documentation

- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Complete production setup
- **[i18n System](./docs/i18n-system.md)** - Translation system details
- **[Asset Storage](./docs/asset-storage.md)** - R2/B2 integration guide
- **[Webhook System](./scripts/webhooks/README.md)** - Revalidation webhooks

## 🛠️ NPM Scripts

### Translation
```bash
npm run translate:run           # Translate all missing locales
npm run translate:dry           # Preview without changes
npm run translate:force         # Re-translate everything
npm run translate:run -- --type=character  # Translate specific type
npm run translate:run -- --id=doc-123      # Translate specific doc
```

### Assets
```bash
npm run assets:upload           # Upload single file
npm run assets:migrate          # Migrate all assets
npm run assets:migrate:dry      # Preview migration
npm run assets:migrate -- --type=character  # Migrate specific type
```

### Webhooks
```bash
npm run sanity:webhooks:dev     # Start dev webhook server
```

## 🌐 Frontend Usage

### Get Localized Content
```tsx
import { getLocalizedContent, getLocalizedArray } from '@/lib/i18n'

// In your component
const character = await getCharacter(slug)
const locale = params.locale  // from route

const name = getLocalizedContent(character.name, locale)
const overview = getLocalizedContent(character.overview, locale)
const pros = getLocalizedArray(character.pros, locale)
```

### Locale Switcher
```tsx
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

<nav>
  <LocaleSwitcher />
</nav>
```

### Translation Status
```tsx
import { TranslationStatus } from '@/components/TranslationStatus'

<TranslationStatus document={character} locale={locale} />
// Shows: "Verified Translation" or "Auto-Translated"
```

### Asset URLs
```tsx
import { getAssetUrl } from '@/lib/i18n'

const imageUrl = getAssetUrl(
  character.portraitCdn,  // CDN data
  character.image,        // Sanity asset (fallback)
  '/placeholder.png'      // Default (fallback)
)

<img src={imageUrl} alt={character.name.en} />
```

## 🔧 Sanity Studio Actions

### Translate Missing Locales
1. Open document in Sanity Studio
2. Click "Translate Missing Locales" (🌐)
3. Translations appear in `autoTranslatedLocales`

### Mark Locale Reviewed
1. Open document in Sanity Studio
2. Click "Mark Locale Reviewed" (✓)
3. Enter locale code (vi, jp, zh)
4. Locale moves to `i18nReadyLocales`

### Push Build / Revalidate
1. Open document in Sanity Studio
2. Click "Push Build / Revalidate" (🚀)
3. Triggers site revalidation

## 📊 Schema Changes

All changes are **non-breaking** additions:

### New i18n Fields
```typescript
{
  name: { en, vi, jp, zh },          // Extended from { en, vi }
  overview: { en, vi, jp, zh },      // Extended from { en, vi }
  skills: [
    { 
      name: { en, vi, jp, zh },      // Extended from { en, vi }
      description: { en, vi, jp, zh } // Extended from { en, vi }
    }
  ],
  pros: [{ en, vi, jp, zh }],        // Extended from { en, vi }
  cons: [{ en, vi, jp, zh }],        // Extended from { en, vi }
}
```

### New Metadata Fields
```typescript
{
  i18nReadyLocales: ['en', 'vi'],
  autoTranslatedLocales: ['jp', 'zh'],
  translationHash: 'abc123...',
  sourceUrl: 'https://...',
  imageLicense: 'CC BY-SA 4.0',
  imageAttribution: '...'
}
```

### New CDN Fields
```typescript
{
  portraitCdn: {
    cdnUrl: 'https://assets.example.com/...',
    originalUrl: 'https://...',
    localFile: './public/...'
  },
  splashCdn: { ... },
  imageCdn: { ... },
  coverCdn: { ... }
}
```

## 🔐 Security

### Environment Variables
- **Never commit** `.env.local`
- Use **different keys** for dev/prod
- **Rotate API keys** periodically

### Webhook Security
- Use **strong WEBHOOK_SECRET**
- Verify **HMAC signatures**
- Use **HTTPS only**

### Asset Security
- Sanitize file uploads
- Set file size limits
- Monitor bucket access

## 💰 Cost Optimization

### Translation Costs
- **Use cache**: Reduces duplicate translations by 80%+
- **Edit glossary**: Reduces token usage
- **Incremental updates**: Translate only changed content
- **Dry run first**: Preview before running

**Estimated Costs (OpenAI GPT-4o-mini):**
- Character translation: ~$0.02 per character (all 3 locales)
- 100 characters: ~$2.00
- Cache hit: $0.00

### Storage Costs
**Cloudflare R2:**
- Storage: $0.015/GB/month
- Egress: FREE
- 100GB example: $1.50/month

**Backblaze B2:**
- Storage: $0.005/GB/month
- Egress: First 1GB/day free, then $0.01/GB
- 100GB storage + 10GB/day egress: ~$27.50/month

## 🐛 Troubleshooting

### Translation Issues
```bash
# Force re-translate
npm run translate:force

# Check specific document
npm run translate:run -- --id=doc-id

# Clear cache
rm -rf scripts/i18n/cache/*.json
```

### Asset Issues
```bash
# Re-upload with force
npm run assets:migrate -- --force

# Test single upload
npm run assets:upload -- --file=test.jpg --doc-type=character --slug=test --asset-type=portrait
```

### Webhook Issues
- Check Sanity webhook logs
- Verify WEBHOOK_SECRET matches
- Test endpoint: `curl https://yourdomain.com/api/revalidate`

## 📈 Monitoring

### Translation Coverage
```bash
# Run dry run to see what needs translation
npm run translate:dry
```

### Asset Migration Status
In Sanity Vision:
```groq
// Count migrated portraits
*[_type == "character" && defined(portraitCdn.cdnUrl)] | length

// Find non-migrated
*[_type == "character" && !defined(portraitCdn.cdnUrl)]
```

### Build/Revalidation
- Check build platform logs (Vercel/Netlify)
- Monitor webhook delivery in Sanity dashboard
- Check Next.js revalidation logs

## 🎯 Best Practices

### Translation
1. **Always dry run first** before production translation
2. **Review auto-translations** and mark as reviewed
3. **Update glossary** with new game terms
4. **Translate incrementally** for large updates
5. **Cache aggressively** to reduce costs

### Assets
1. **Optimize images** before upload (WebP, compression)
2. **Use descriptive names** for better organization
3. **Test single file** before batch migration
4. **Monitor storage costs** regularly
5. **Clean unused assets** periodically

### Deployment
1. **Test in staging** before production
2. **Backup Sanity data** before major changes
3. **Monitor performance** after deployment
4. **Review user feedback** on translations
5. **Keep documentation updated**

## 📝 Migration Checklist

- [ ] Backup Sanity data
- [ ] Configure environment variables
- [ ] Test translation with dry run
- [ ] Run translation for all content
- [ ] Review translation quality
- [ ] Test asset upload single file
- [ ] Migrate assets with dry run
- [ ] Run asset migration
- [ ] Verify CDN URLs work
- [ ] Configure Sanity webhooks
- [ ] Test revalidation
- [ ] Update frontend code
- [ ] Deploy to staging
- [ ] Test all locales
- [ ] Deploy to production
- [ ] Monitor for issues

## 🆘 Support

### Documentation
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [i18n System](./docs/i18n-system.md)
- [Asset Storage](./docs/asset-storage.md)
- [Webhooks](./scripts/webhooks/README.md)

### Common Issues
- Check relevant documentation above
- Review error logs
- Verify configuration
- Test with minimal example
- Check GitHub issues

### Getting Help
1. Check documentation first
2. Review troubleshooting sections
3. Test individual components
4. Provide detailed error logs when asking for help

## 📜 License

This system is part of duetnightabyss.gachabuild.com. 

## 🙏 Acknowledgments

Built with:
- **Next.js 15** - React framework
- **Sanity.io** - Headless CMS
- **OpenAI GPT-4** - AI translation
- **Cloudflare R2** - Asset storage
- **TypeScript** - Type safety

---

**Ready to deploy? Follow the [Setup Guide](./docs/SETUP_GUIDE.md)!**

