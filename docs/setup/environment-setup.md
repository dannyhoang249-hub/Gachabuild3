---
title: "Environment Configuration"
description: "Complete environment variable setup for all system components"
last_updated: "2025-10-27"
related_files: ["README.md", "deployment-guide.md"]
tags: ["environment", "configuration", "api-keys"]
---

# Environment Configuration

Complete guide for setting up environment variables for the duetnightabyss.gachabuild.com system.

## 📋 Environment File Structure

Create `.env.local` in your project root:

```bash
# Core Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your-write-token

# Translation Service Configuration
TRANSLATION_SERVICE=openai
OPENAI_API_KEY=sk-...
TRANSLATE_LANGS=vi,jp,zh

# Asset Storage Configuration
ASSET_STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=...
R2_BUCKET=gachabuild-assets
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://assets.yourdomain.com

# Webhook Configuration
WEBHOOK_SECRET=random-secret-string

# Optional: Build Hooks
VERCEL_BUILD_HOOK=https://api.vercel.com/v1/integrations/deploy/xxxxx
NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/xxxxx
```

## 🔧 Sanity Configuration

### Required Variables

```bash
# Your Sanity project ID (found in sanity.config.ts)
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u

# Dataset name (usually 'production')
NEXT_PUBLIC_SANITY_DATASET=production

# Write token for API operations
SANITY_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Getting Sanity Token

1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Create new token with **Editor** permissions
5. Copy the token to `SANITY_TOKEN`

## 🌐 Translation Configuration

### OpenAI Setup (Recommended)

```bash
TRANSLATION_SERVICE=openai
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TRANSLATE_LANGS=vi,jp,zh
```

**Getting OpenAI API Key:**
1. Visit [OpenAI API Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy to `OPENAI_API_KEY`

### DeepL Setup (Alternative)

```bash
TRANSLATION_SERVICE=deepl
DEEPL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
TRANSLATE_LANGS=vi,ja,zh
```

**Getting DeepL API Key:**
1. Sign up at [DeepL API](https://www.deepl.com/pro-api)
2. Get your authentication key
3. Copy to `DEEPL_API_KEY`

### Translation Options

```bash
# Supported language codes
TRANSLATE_LANGS=vi,jp,zh  # Vietnamese, Japanese, Chinese

# Optional: Custom glossary
TRANSLATION_GLOSSARY_PATH=./scripts/i18n/glossary.json

# Optional: Translation caching (default: 30 days)
TRANSLATION_CACHE_TTL=2592000
```

## 💾 Asset Storage Configuration

### Cloudflare R2 Setup (Recommended)

```bash
ASSET_STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=your-account-id
R2_BUCKET=gachabuild-assets
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_PUBLIC_URL=https://assets.yourdomain.com
```

**Getting R2 Credentials:**
1. Go to Cloudflare Dashboard → R2 Object Storage
2. Create bucket: `gachabuild-assets`
3. Go to **Manage R2 API tokens**
4. Create token with **Object Read & Write** permissions
5. Copy Account ID, Access Key ID, and Secret Access Key

### Backblaze B2 Setup (Alternative)

```bash
ASSET_STORAGE_PROVIDER=b2
B2_ACCOUNT_ID=your-account-id
B2_BUCKET=gachabuild-assets
B2_ACCESS_KEY_ID=your-key-id
B2_SECRET_ACCESS_KEY=your-secret-key
B2_PUBLIC_URL=https://f000.backblazeb2.com/file/gachabuild-assets
```

**Getting B2 Credentials:**
1. Go to Backblaze B2 Console
2. Create bucket: `gachabuild-assets` (public)
3. Create application key with read/write permissions
4. Copy credentials

## 🔗 Webhook Configuration

### Basic Webhook Setup

```bash
# Secret for HMAC signature verification
WEBHOOK_SECRET=your-random-secret-string-here

# Optional: Revalidation endpoint
NEXT_REVALIDATE_TOKEN=your-revalidation-token
```

### Platform-Specific Build Hooks

**Vercel:**
```bash
VERCEL_BUILD_HOOK=https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxx
```

**Netlify:**
```bash
NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/xxxxx
```

**Custom VPS:**
```bash
CUSTOM_BUILD_HOOK=https://yourdomain.com/api/build
```

## 🔒 Security Configuration

### API Rate Limiting

```bash
# Translation API rate limits
OPENAI_RATE_LIMIT=60  # requests per minute
DEEPL_RATE_LIMIT=100  # requests per minute

# Asset upload rate limits
ASSET_UPLOAD_RATE_LIMIT=10  # uploads per minute
```

### CORS Configuration

```bash
# Allowed origins for API requests
CORS_ORIGINS=https://duetnightabyss.gachabuild.com,https://studio.duetnightabyss.gachabuild.com

# Asset CORS configuration
ASSET_CORS_ORIGINS=*  # or specific domains
```

## 🧪 Development vs Production

### Development (.env.local)

```bash
# Use development dataset
NEXT_PUBLIC_SANITY_DATASET=development

# Use test buckets
R2_BUCKET=gachabuild-assets-dev

# Disable webhooks in development
DISABLE_WEBHOOKS=true
```

### Production

```bash
# Use production dataset
NEXT_PUBLIC_SANITY_DATASET=production

# Use production buckets
R2_BUCKET=gachabuild-assets

# Enable all features
DISABLE_WEBHOOKS=false
```

## ✅ Validation

Test your configuration:

```bash
# Test Sanity connection
npm run check:sanity

# Test translation service
npm run translate:test

# Test asset storage
npm run assets:test

# Test webhooks
npm run webhooks:test
```

## 🔍 Troubleshooting

**Common Issues:**

1. **Sanity Token Invalid:**
   - Verify token has correct permissions
   - Check project ID matches

2. **Translation API Errors:**
   - Verify API key is valid
   - Check rate limits
   - Ensure sufficient credits

3. **Asset Upload Failures:**
   - Verify bucket permissions
   - Check CORS configuration
   - Validate credentials

4. **Webhook Not Firing:**
   - Verify secret matches
   - Check endpoint accessibility
   - Review webhook logs

See [Troubleshooting Guide](./troubleshooting.md) for detailed solutions.
