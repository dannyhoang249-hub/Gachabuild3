---
title: "Setup Guide Overview"
description: "Complete setup guide for duetnightabyss.gachabuild.com i18n and asset system"
last_updated: "2025-10-27"
related_files: ["environment-setup.md", "deployment-guide.md", "troubleshooting.md"]
tags: ["setup", "deployment", "i18n", "assets"]
---

# Production Setup Guide

Complete setup guide for the duetnightabyss.gachabuild.com i18n and asset system.

## 📋 Prerequisites

- Node.js 18+
- Sanity account with existing project
- OpenAI API key OR DeepL API key
- Cloudflare R2 OR Backblaze B2 account

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` - see [Environment Setup](./environment-setup.md) for complete configuration.

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

## 📚 Setup Phases

### Phase 1: Schema Migration
- Deploy updated Sanity schemas
- Verify document actions appear in Studio

### Phase 2: Translation Setup
- Configure OpenAI or DeepL API
- Test translation functionality
- Set up glossary system

### Phase 3: Asset Migration
- Setup R2/B2 storage provider
- Migrate existing assets from Sanity
- Configure CDN delivery

### Phase 4: Webhook Configuration
- Setup revalidation endpoints
- Configure build hooks
- Test webhook functionality

### Phase 5: Frontend Integration
- Update character/weapon pages
- Implement localized routing
- Test multilingual functionality

## 📖 Detailed Guides

- **[Environment Setup](./environment-setup.md)** - Complete environment variable configuration
- **[Deployment Guide](./deployment-guide.md)** - Platform-specific deployment instructions
- **[SSL Setup](./ssl-setup.md)** - SSL certificate configuration for VPS
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## 🔧 Maintenance

### Regular Tasks

**Weekly:**
- Review auto-translated content
- Mark verified translations as reviewed
- Check translation quality

**Monthly:**
- Update translation glossary
- Review asset storage usage
- Check webhook logs

**As Needed:**
- Re-translate when English content updates
- Migrate new assets
- Update webhook configuration

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env.local`
   - Use different keys for dev/prod
   - Rotate API keys periodically

2. **API Security:**
   - Use HTTPS for all webhooks
   - Implement HMAC signature verification
   - Rate limit translation requests

3. **Asset Security:**
   - Use signed URLs for private assets
   - Configure CORS properly
   - Monitor access patterns

4. **Sanity Security:**
   - Use role-based tokens
   - Limit token permissions
   - Enable MFA on Sanity account

## 🆘 Getting Help

1. Check specific documentation:
   - [i18n System](../features/i18n/README.md)
   - [Asset Storage](../features/assets/README.md)
   - [Search System](../features/search/README.md)

2. Run diagnostic commands:
   ```bash
   npm run translate:dry
   npm run assets:migrate:dry
   npm run sanity:webhooks:dev
   ```

3. Review logs and error messages in [Troubleshooting Guide](./troubleshooting.md)

## ➡️ Next Steps

After setup is complete:

1. **Optimize Performance:**
   - Enable CDN caching
   - Configure ISR properly
   - Monitor build times

2. **Content Management:**
   - Train team on translation workflow
   - Establish content review process
   - Set up monitoring alerts

3. **Scaling:**
   - Plan for additional languages
   - Optimize asset delivery
   - Consider edge deployment
