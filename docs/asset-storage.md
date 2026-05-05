# Asset Storage System (R2/B2)

This document describes the hybrid asset storage system using Cloudflare R2 or Backblaze B2.

## Overview

The system stores heavy images on external CDN storage (R2/B2) while keeping metadata references in Sanity.

**Benefits:**
- Reduced Sanity storage costs
- Faster asset delivery via CDN
- Better control over caching
- Support for larger files

## Architecture

```
Local/URL Image
    ↓
Download to Temp
    ↓
Upload to R2/B2
    ↓
Update Sanity Document
    ↓
Delete Temp File
```

## Setup

### Choose Storage Provider

**Option A: Cloudflare R2** (Recommended)
- Free egress bandwidth
- S3-compatible API
- Excellent global performance

**Option B: Backblaze B2**
- Competitive pricing
- First 1GB egress free daily
- Good for cost-conscious deployments

### Cloudflare R2 Setup

1. **Create R2 Bucket:**
   - Go to Cloudflare Dashboard → R2
   - Create bucket: `gachabuild-assets`
   - Set public access if needed

2. **Create API Token:**
   - R2 → Manage R2 API Tokens
   - Create token with Object Read & Write
   - Note: `Access Key ID` and `Secret Access Key`

3. **Configure Domain (Optional):**
   - R2 bucket → Settings → Custom Domain
   - Connect domain: `assets.yourdomain.com`

4. **Set Environment Variables:**
   ```bash
   ASSET_STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=your-account-id
   R2_BUCKET=gachabuild-assets
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   R2_PUBLIC_URL=https://assets.yourdomain.com
   ```

### Backblaze B2 Setup

1. **Create Bucket:**
   - Backblaze → Buckets → Create a Bucket
   - Name: `gachabuild-assets`
   - Files in bucket: Public

2. **Create Application Key:**
   - App Keys → Add a New Application Key
   - Note: `keyID` and `applicationKey`

3. **Set Environment Variables:**
   ```bash
   ASSET_STORAGE_PROVIDER=b2
   B2_APPLICATION_KEY_ID=...
   B2_APPLICATION_KEY=...
   B2_BUCKET_ID=...
   B2_BUCKET_NAME=gachabuild-assets
   B2_PUBLIC_URL=https://f002.backblazeb2.com/file/gachabuild-assets
   ```

## Usage

### Upload Single File

**From Local File:**
```bash
npm run assets:upload -- \
  --file=./public/characters/new-character.png \
  --doc-type=character \
  --slug=new-character \
  --asset-type=portrait
```

**From URL:**
```bash
npm run assets:upload -- \
  --url=https://example.com/image.jpg \
  --doc-type=character \
  --slug=character-name \
  --asset-type=portrait
```

**By Document ID:**
```bash
npm run assets:upload -- \
  --file=./image.png \
  --id=character-abc123 \
  --asset-type=splash
```

### Migrate Existing Assets

**Migrate All Documents:**
```bash
npm run assets:migrate
```

**Dry Run (Preview):**
```bash
npm run assets:migrate:dry
```

**Migrate Specific Type:**
```bash
npm run assets:migrate -- --type=character
```

**Migrate Specific Document:**
```bash
npm run assets:migrate -- --id=character-123
```

**Force Re-upload:**
```bash
npm run assets:migrate -- --force
```

## Asset Types

### Character Assets

- **portrait** → `portraitCdn`
  - Main character image
  - Path: `character/{slug}/portrait.{ext}`

- **splash** → `splashCdn`
  - Full-size character artwork
  - Path: `character/{slug}/splash.{ext}`

### Weapon Assets

- **image** → `imageCdn`
  - Weapon icon/image
  - Path: `weapon/{slug}/image.{ext}`

### Guide Assets

- **cover** → `coverCdn`
  - Guide cover image
  - Path: `guide/{slug}/cover.{ext}`

## Schema Structure

Each asset type has a CDN object in Sanity:

```typescript
{
  portraitCdn: {
    cdnUrl: 'https://assets.example.com/character/alice/portrait.png',
    originalUrl: 'https://source-site.com/original.png',  // if migrated from URL
    localFile: './public/characters/alice.png'  // if uploaded from local
  }
}
```

## Migration Process

### Pre-Migration Checklist

1. **Backup Sanity Data:**
   ```bash
   sanity dataset export production backup.tar.gz
   ```

2. **Test Storage Provider:**
   ```bash
   npm run assets:upload -- \
     --file=./test.jpg \
     --doc-type=character \
     --slug=test \
     --asset-type=portrait
   ```

3. **Verify Upload:**
   - Check R2/B2 dashboard
   - Verify public URL accessible

### Running Migration

1. **Dry Run First:**
   ```bash
   npm run assets:migrate:dry
   ```
   - Reviews what will be migrated
   - Shows potential errors
   - No changes made

2. **Review Output:**
   ```
   📄 Character Name
     📥 image: Downloading from Sanity...
     ⬆️  image: Uploading to R2...
     ✅ image: https://assets.example.com/character/slug/image.png
   ```

3. **Run Migration:**
   ```bash
   npm run assets:migrate
   ```

4. **Verify Results:**
   - Check Sanity documents for `cdnUrl`
   - Test frontend displays images
   - Verify CDN headers (cache-control)

### Post-Migration

**Update Frontend Code:**

```tsx
import { getAssetUrl } from '@/lib/i18n'

const imageUrl = getAssetUrl(
  character.portraitCdn,
  character.image,
  '/characters/placeholder.svg'
)

<img src={imageUrl} alt={character.name.en} />
```

## Rollback Plan

If migration fails or issues occur:

1. **Sanity Assets Still Work:**
   - Original Sanity assets are NOT deleted
   - Frontend can fall back to Sanity URLs

2. **Restore CDN Fields:**
   ```bash
   # Run script to clear CDN fields
   # (You'd need to create this)
   npm run assets:clear-cdn-fields
   ```

3. **Restore from Backup:**
   ```bash
   sanity dataset import backup.tar.gz production
   ```

## Cost Optimization

### Storage Costs

**Cloudflare R2:**
- $0.015/GB/month storage
- Free egress (huge saving!)
- Example: 100GB = $1.50/month

**Backblaze B2:**
- $0.005/GB/month storage
- First 1GB egress free daily
- $0.01/GB egress after free tier
- Example: 100GB storage + 10GB/day egress = $0.50/month + ~$27/month egress

### Optimization Tips

1. **Image Optimization:**
   - Use WebP format where possible
   - Compress images before upload
   - Consider responsive images

2. **Lazy Loading:**
   ```tsx
   <img loading="lazy" src={imageUrl} />
   ```

3. **Cache Headers:**
   - Assets uploaded with: `cache-control: public, max-age=31536000, immutable`
   - CDN caching reduces origin requests

4. **Cleanup Unused Assets:**
   - Periodically audit R2/B2 bucket
   - Remove assets for deleted documents

## Monitoring

### Check Upload Status

```bash
# View recent uploads in R2 dashboard
# Or use AWS CLI with R2:
aws s3 ls s3://gachabuild-assets/character/ \
  --endpoint-url=https://your-account-id.r2.cloudflarestorage.com
```

### Monitor Costs

- **R2:** Cloudflare Dashboard → R2 → Analytics
- **B2:** Backblaze → Buckets → Usage

### Asset Inventory

Create a script to list all assets:

```bash
# Count assets by type
aws s3 ls s3://gachabuild-assets/ --recursive | wc -l
```

## Troubleshooting

### Upload Fails

**Error: "Access Denied"**
- Check API credentials
- Verify bucket permissions
- Ensure bucket exists

**Error: "Timeout"**
- Increase `ASSET_UPLOAD_TIMEOUT`
- Check network connection
- Try smaller files first

### Migration Stalls

**Issue: Script hangs**
- Check `ASSET_MAX_CONCURRENT` (lower it)
- Verify API rate limits
- Check network stability

**Issue: Some assets skip**
- Run with `--force` to re-upload
- Check Sanity asset references
- Verify temp directory has space

### CDN URLs Not Working

**Issue: 404 on CDN URL**
- Verify R2_PUBLIC_URL is correct
- Check bucket is public (if needed)
- Confirm file uploaded successfully

**Issue: CORS errors**
- Add CORS policy to R2 bucket
- Check allowed origins

## Advanced Features

### Custom File Naming

Edit `scripts/assets/storage/index.ts`:

```typescript
export function generateRemotePath(
  docType: string,
  slug: string,
  assetType: string,
  filename: string
): string {
  const timestamp = Date.now()
  const ext = filename.split('.').pop()
  return `${docType}/${slug}/${assetType}-${timestamp}.${ext}`
}
```

### Automatic Image Optimization

Add sharp processing before upload:

```typescript
import sharp from 'sharp'

// In upload script
const buffer = await sharp(localPath)
  .resize(1200, null, { withoutEnlargement: true })
  .webp({ quality: 85 })
  .toBuffer()
```

### Batch Upload from Directory

```bash
# Custom script
for file in public/characters/*.jpg; do
  slug=$(basename "$file" .jpg)
  npm run assets:upload -- \
    --file="$file" \
    --doc-type=character \
    --slug="$slug" \
    --asset-type=portrait
done
```

## Security

### API Key Management

- Never commit API keys to git
- Use environment variables only
- Rotate keys periodically
- Use separate keys for dev/prod

### Bucket Security

**Public Buckets:**
- Enable HTTPS only
- Set CORS policies
- Monitor access logs

**Private Buckets:**
- Use signed URLs
- Implement access tokens
- Time-limited links

### Content Policy

- Scan uploaded images for policy violations
- Implement file type restrictions
- Set file size limits
- Virus scanning for user uploads

## Performance

**Typical Upload Times:**
- Small image (100KB): ~2 seconds
- Medium image (1MB): ~5 seconds
- Large image (5MB): ~15 seconds
- Batch (100 images): ~30 minutes (with concurrency limit)

**Optimization:**
- Parallel uploads: Set `ASSET_MAX_CONCURRENT=5`
- Use CDN for distribution
- Enable HTTP/2
- Implement image lazy loading

## Support

For issues:
1. Check R2/B2 dashboard for errors
2. Review upload logs
3. Verify configuration
4. Test with single file first

