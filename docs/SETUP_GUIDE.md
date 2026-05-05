# Production Setup Guide

Complete setup guide for the duetnightabyss.gachabuild.com i18n and asset system.

## Prerequisites

- Node.js 18+
- Sanity account with existing project
- OpenAI API key OR DeepL API key
- Cloudflare R2 OR Backblaze B2 account

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your-write-token

# Translation
TRANSLATION_SERVICE=openai
OPENAI_API_KEY=sk-...
TRANSLATE_LANGS=vi,jp,zh

# Assets
ASSET_STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=...
R2_BUCKET=gachabuild-assets
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://assets.yourdomain.com

# Webhooks
WEBHOOK_SECRET=random-secret-string
```

### 3. Test Configuration

```bash
# Test Sanity connection
npm run check:characters

# Test translation (dry run)
npm run translate:dry

# Test asset upload
npm run assets:upload -- \
  --file=./test.jpg \
  --doc-type=character \
  --slug=test \
  --asset-type=portrait
```

## Step-by-Step Setup

### Phase 1: Schema Migration

1. **Deploy Updated Schemas:**
   ```bash
   npm run studio
   # In Sanity Studio, schemas will auto-update
   ```

2. **Verify New Fields:**
   - Open any character in Sanity Studio
   - Check for new fields:
     - i18n Ready Locales
     - Auto-Translated Locales
     - Translation Hash
     - Portrait CDN
     - Splash CDN

3. **Test Document Actions:**
   - Open a document
   - Verify actions appear:
     - 🌐 Translate Missing Locales
     - ✓ Mark Locale Reviewed
     - 🚀 Push Build / Revalidate

### Phase 2: Translation Setup

1. **Configure Translation Service:**

   **OpenAI:**
   ```bash
   TRANSLATION_SERVICE=openai
   OPENAI_API_KEY=sk-...
   ```

   **DeepL:**
   ```bash
   TRANSLATION_SERVICE=deepl
   DEEPL_API_KEY=...
   ```

2. **Customize Glossary:**
   Edit `scripts/i18n/glossary.json` with your game-specific terms.

3. **Test Translation:**
   ```bash
   # Translate one character as test
   npm run translate:dry -- --type=character --id=your-test-character-id
   ```

4. **Review Output:**
   - Check translation quality
   - Verify glossary terms applied
   - Confirm numbers/percentages preserved

5. **Run Full Translation:**
   ```bash
   npm run translate:run
   ```

6. **Monitor Progress:**
   ```
   📄 Character Name
     🌐 Translating to vi...
     🌐 Translating to jp...
     🌐 Translating to zh...
     ✅ Translation completed
   ```

### Phase 3: Asset Migration

1. **Setup Storage Provider:**
   - Follow R2 or B2 setup in [Asset Storage Guide](./asset-storage.md)
   - Configure environment variables
   - Test upload single file

2. **Dry Run Migration:**
   ```bash
   npm run assets:migrate:dry
   ```

3. **Review Migration Plan:**
   - Check how many assets will be migrated
   - Verify paths look correct
   - Note any errors

4. **Run Migration:**
   ```bash
   npm run assets:migrate
   ```

5. **Verify Results:**
   - Check Sanity documents for CDN URLs
   - Test images load on frontend
   - Verify R2/B2 dashboard shows files

### Phase 4: Webhook Configuration

1. **Setup Revalidation Endpoint:**
   - Deploy Next.js app with `/api/revalidate` route
   - Note the public URL

2. **Configure Sanity Webhook:**
   - Go to Sanity Dashboard → API → Webhooks
   - Create webhook:
     ```
     Name: Content Revalidation
     URL: https://yourdomain.com/api/revalidate
     Dataset: production
     Trigger: Create, Update, Delete
     Filter: _type in ["character", "weapon", "guide"]
     Secret: [match WEBHOOK_SECRET env var]
     ```

3. **Test Webhook:**
   ```bash
   # Start dev webhook server
   npm run sanity:webhooks:dev
   
   # In another terminal, update a document in Sanity
   # Check webhook server logs
   ```

4. **Configure Build Hook (Optional):**
   ```bash
   # Netlify
   NEXT_BUILD_HOOK=https://api.netlify.com/build_hooks/xxxxx
   
   # Vercel
   NEXT_BUILD_HOOK=https://api.vercel.com/v1/integrations/deploy/xxxxx
   ```

### Phase 5: Frontend Integration

1. **Update Character Pages:**
   ```tsx
   // app/[locale]/characters/[slug]/page.tsx
   import { getLocalizedContent } from '@/lib/i18n'
   
   export default async function CharacterPage({ params }) {
     const { locale, slug } = params
     const character = await getCharacter(slug)
     
     const name = getLocalizedContent(character.name, locale)
     const overview = getLocalizedContent(character.overview, locale)
     
     return (
       <div>
         <h1>{name}</h1>
         <p>{overview}</p>
       </div>
     )
   }
   ```

2. **Add Locale Switcher:**
   ```tsx
   // components/Header.tsx
   import { LocaleSwitcher } from '@/components/LocaleSwitcher'
   
   export function Header() {
     return (
       <header>
         <nav>
           <LocaleSwitcher />
         </nav>
       </header>
     )
   }
   ```

3. **Update SEO:**
   ```tsx
   // app/[locale]/characters/[slug]/metadata.ts
   import { generateAlternateLinks } from '@/lib/i18n'
   
   export async function generateMetadata({ params }) {
     const alternates = generateAlternateLinks(`/${params.locale}/characters/${params.slug}`)
     
     return {
       alternates: {
         languages: Object.fromEntries(
           alternates.map(({ hreflang, href }) => [hreflang, href])
         )
       }
     }
   }
   ```

## Deployment

### Vercel

1. **Set Environment Variables:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.local`

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure Webhook:**
   - Use Vercel deploy URL in Sanity webhook

### Netlify

1. **Set Environment Variables:**
   - Netlify Dashboard → Site → Site settings → Environment Variables
   - Add all variables

2. **Configure Build:**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### VPS/Custom Server

1. **Build Application:**
   ```bash
   npm run build
   ```

2. **Start Server:**
   ```bash
   npm start
   ```

3. **Setup Process Manager:**
   ```bash
   pm2 start npm --name "gachabuild" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx:**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Maintenance

### Regular Tasks

**Weekly:**
- Review auto-translated content
- Mark verified translations as reviewed
- Check translation quality

**Monthly:**
- Review asset storage costs
- Clean up unused assets
- Check translation cache size
- Update glossary with new terms

**As Needed:**
- Re-translate when English content updates
- Migrate new assets
- Update webhook configuration

### Monitoring

**Translation Metrics:**
```bash
# Check translation status
npm run translate:dry

# View cache statistics
ls -lh scripts/i18n/cache/ | wc -l
```

**Asset Metrics:**
```bash
# Count migrated assets
# In Sanity Vision:
*[defined(portraitCdn.cdnUrl)] | length
```

**Build Metrics:**
- Monitor build times
- Check revalidation logs
- Review CDN hit rates

## Troubleshooting

### Common Issues

**1. Translations Missing:**
```bash
# Force re-translate
npm run translate:force

# Check specific document
npm run translate:run -- --id=doc-id
```

**2. Assets Not Loading:**
```bash
# Verify CDN configuration
curl -I https://assets.yourdomain.com/test.jpg

# Re-upload specific asset
npm run assets:upload -- --id=doc-id --asset-type=portrait --force
```

**3. Webhooks Not Firing:**
- Check Sanity webhook logs
- Verify WEBHOOK_SECRET matches
- Test endpoint: `curl -X POST https://yourdomain.com/api/revalidate`

**4. Build Failures:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Getting Help

1. Check documentation:
   - [i18n System](./i18n-system.md)
   - [Asset Storage](./asset-storage.md)
   - [Webhooks](../scripts/webhooks/README.md)

2. Review logs:
   - Translation: Check console output
   - Assets: Check upload script logs
   - Webhooks: Check server logs

3. Validate configuration:
   ```bash
   # Test each system independently
   npm run translate:dry
   npm run assets:migrate:dry
   npm run sanity:webhooks:dev
   ```

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env.local`
   - Use different keys for dev/prod
   - Rotate API keys periodically

2. **Webhook Security:**
   - Use strong WEBHOOK_SECRET
   - Verify signatures
   - Use HTTPS only

3. **Asset Security:**
   - Sanitize file uploads
   - Set file size limits
   - Monitor bucket access

4. **Sanity Security:**
   - Use role-based tokens
   - Limit token permissions
   - Enable MFA on Sanity account

## Next Steps

After setup is complete:

1. **Optimize Performance:**
   - Enable CDN caching
   - Implement image optimization
   - Use route-based code splitting

2. **Enhance Quality:**
   - Manual review of translations
   - A/B test translation quality
   - Gather user feedback

3. **Scale:**
   - Add more locales
   - Automate translation workflows
   - Implement translation memory

4. **Monitor:**
   - Set up analytics
   - Track translation coverage
   - Monitor costs

