---
title: "Setup Troubleshooting Guide"
description: "Common issues and solutions for setup and deployment"
last_updated: "2025-10-27"
related_files: ["README.md", "environment-setup.md", "deployment-guide.md"]
tags: ["troubleshooting", "debugging", "issues", "solutions"]
---

# Setup Troubleshooting Guide

Common issues and solutions encountered during setup and deployment.

## 🔧 Sanity Configuration Issues

### Issue: Sanity Token Invalid

**Symptoms:**
- API requests return 401 Unauthorized
- "Invalid token" errors in console

**Solutions:**
```bash
# 1. Verify token permissions
# Go to Sanity Management → API → Tokens
# Ensure token has "Editor" or "Admin" permissions

# 2. Check project ID
# Verify NEXT_PUBLIC_SANITY_PROJECT_ID matches your project

# 3. Test connection
npm run check:sanity
```

### Issue: Schema Migration Errors

**Symptoms:**
- Document actions not appearing in Studio
- Schema validation errors

**Solutions:**
```bash
# 1. Clear Sanity cache
rm -rf .sanity

# 2. Restart Sanity Studio
npm run studio

# 3. Force schema update
sanity schema extract --path=schema.json
```

## 🌐 Translation Service Issues

### Issue: OpenAI API Errors

**Symptoms:**
- "Insufficient quota" errors
- Rate limit exceeded messages

**Solutions:**
```bash
# 1. Check API key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# 2. Verify billing and usage
# Visit OpenAI Dashboard → Usage

# 3. Implement rate limiting
OPENAI_RATE_LIMIT=30  # Reduce requests per minute
```

### Issue: Translation Cache Problems

**Symptoms:**
- Translations not updating
- Stale cached content

**Solutions:**
```bash
# 1. Clear translation cache
rm -rf scripts/i18n/cache/*

# 2. Force re-translation
npm run translate:force

# 3. Check cache permissions
ls -la scripts/i18n/cache/
```

### Issue: DeepL API Errors

**Symptoms:**
- Authentication failures
- Character limit exceeded

**Solutions:**
```bash
# 1. Verify API key format
# DeepL keys end with ":fx"

# 2. Check usage limits
# Visit DeepL Account → Usage

# 3. Switch to OpenAI temporarily
TRANSLATION_SERVICE=openai
```

## 💾 Asset Storage Issues

### Issue: R2/B2 Upload Failures

**Symptoms:**
- "Access denied" errors
- Upload timeouts

**Solutions:**
```bash
# 1. Test credentials
npm run assets:test

# 2. Check bucket permissions
# Ensure bucket allows public read access

# 3. Verify CORS configuration
# Add your domain to allowed origins

# 4. Check file size limits
# R2: 5TB max, B2: 10GB max per file
```

### Issue: CDN URL Not Working

**Symptoms:**
- Images not loading
- 404 errors on asset URLs

**Solutions:**
```bash
# 1. Verify public URL configuration
curl -I $R2_PUBLIC_URL/test-file.jpg

# 2. Check DNS propagation
nslookup assets.yourdomain.com

# 3. Test direct bucket access
curl -I https://bucket-name.r2.cloudflarestorage.com/file.jpg
```

## 🔗 Webhook Issues

### Issue: Webhooks Not Firing

**Symptoms:**
- Content changes don't trigger revalidation
- Build hooks not working

**Solutions:**
```bash
# 1. Test webhook endpoint
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 2. Check webhook secret
# Ensure WEBHOOK_SECRET matches Sanity configuration

# 3. Verify Sanity webhook logs
# Go to Sanity Management → API → Webhooks → View logs
```

### Issue: HMAC Signature Validation Failing

**Symptoms:**
- "Invalid signature" errors
- Webhook requests rejected

**Solutions:**
```bash
# 1. Verify secret configuration
echo $WEBHOOK_SECRET

# 2. Check signature generation
# Ensure both ends use same algorithm (SHA-256)

# 3. Debug signature validation
# Add logging to webhook handler
```

## 🚀 Deployment Issues

### Issue: Build Failures

**Symptoms:**
- "Module not found" errors
- TypeScript compilation errors

**Solutions:**
```bash
# 1. Clear build cache
rm -rf .next
rm -rf node_modules
npm install

# 2. Check Node.js version
node --version  # Should be 18+

# 3. Verify environment variables
npm run build:debug
```

### Issue: Docker Container Issues

**Symptoms:**
- Containers not starting
- Port binding errors

**Solutions:**
```bash
# 1. Check port availability
netstat -tulpn | grep :3000

# 2. View container logs
docker-compose logs frontend

# 3. Restart services
docker-compose down
docker-compose up -d
```

### Issue: SSL Certificate Problems

**Symptoms:**
- "Certificate not found" errors
- Mixed content warnings

**Solutions:**
```bash
# 1. Verify certificate files
ls -la ./ssl/

# 2. Check certificate validity
openssl x509 -in ./ssl/cert.pem -noout -dates

# 3. Test SSL configuration
nginx -t
```

## 🔍 Debugging Commands

### General Diagnostics

```bash
# Check all services
npm run health:check

# Test Sanity connection
npm run sanity:test

# Test translation service
npm run translate:dry

# Test asset storage
npm run assets:test

# Test webhooks
npm run webhooks:test
```

### Detailed Logging

```bash
# Enable debug mode
DEBUG=* npm run dev

# Sanity debug
SANITY_DEBUG=true npm run studio

# Translation debug
TRANSLATION_DEBUG=true npm run translate:test
```

### System Information

```bash
# Node.js and npm versions
node --version && npm --version

# Docker information
docker --version && docker-compose --version

# System resources
df -h  # Disk space
free -h  # Memory usage
```

##[object Object]ce Issues

### Issue: Slow Build Times

**Solutions:**
```bash
# 1. Enable build caching
NEXT_BUILD_CACHE=true

# 2. Optimize dependencies
npm audit
npm update

# 3. Use build analysis
npm run build:analyze
```

### Issue: High Memory Usage

**Solutions:**
```bash
# 1. Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096"

# 2. Optimize Docker resources
# Update docker-compose.yml:
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 2G
```

## 🆘 Getting Additional Help

### 1. Check Documentation

- [i18n System](../features/i18n/README.md)
- [Asset Storage](../features/assets/README.md)
- [Search System](../features/search/README.md)

### 2. Review Logs

```bash
# Application logs
docker-compose logs -f frontend

# Nginx logs
docker-compose logs -f nginx

# System logs
sudo journalctl -u docker
```

### 3. Community Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Docker Documentation](https://docs.docker.com)

### 4. Create Support Request

When creating a support request, include:

1. **Environment Information:**
   - Node.js version
   - Operating system
   - Docker version

2. **Error Details:**
   - Complete error messages
   - Steps to reproduce
   - Expected vs actual behavior

3. **Configuration:**
   - Relevant environment variables (redacted)
   - Docker compose configuration
   - Nginx configuration

4. **Logs:**
   - Application logs
   - Build logs
   - System logs

### 5. Emergency Rollback

If deployment fails completely:

```bash
# 1. Rollback to previous version
git checkout HEAD~1

# 2. Rebuild and redeploy
npm run build
docker-compose up -d --build

# 3. Verify functionality
curl -I https://yourdomain.com/api/health
```
