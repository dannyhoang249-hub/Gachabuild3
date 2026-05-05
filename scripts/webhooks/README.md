# Webhook System

This directory contains the webhook system for handling Sanity content changes and triggering site revalidation.

## Components

### 1. Sanity Webhooks

Configure webhooks in Sanity Studio (https://www.sanity.io/manage):

1. Go to your project → API → Webhooks
2. Create a new webhook:
   - **Name**: Content Revalidation
   - **URL**: `https://your-domain.com/api/revalidate` (production) or use the dev server
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type in ["character", "weapon", "guide"]`
   - **HTTP method**: POST
   - **Secret**: Set to match your `WEBHOOK_SECRET` env var
   - **Projection**: `{ _id, _type, slug, translationHash, autoTranslatedLocales }`

### 2. Next.js Revalidation Endpoint

Located at `/src/app/api/revalidate/route.ts`

This endpoint:
- Verifies webhook secret
- Revalidates affected paths for all locales
- Supports both path-based and tag-based revalidation

### 3. Development Webhook Server

For local testing:

```bash
npm run sanity:webhooks:dev
```

This starts a local webhook server on port 3001 that:
- Receives Sanity webhooks
- Logs the payload
- Forwards to your Next.js revalidation endpoint
- Optionally triggers build hooks

## Environment Variables

```env
# Webhook security
WEBHOOK_SECRET=your-secret-key

# Revalidation
NEXT_REVALIDATE_URL=http://localhost:3000/api/revalidate

# Build hooks (optional)
NEXT_BUILD_HOOK=https://api.netlify.com/build_hooks/xxxxx
# or
NEXT_BUILD_HOOK=https://api.vercel.com/v1/integrations/deploy/xxxxx

# Dev server
WEBHOOK_DEV_PORT=3001
TRIGGER_BUILD=false
```

## Testing

1. Start your Next.js app:
   ```bash
   npm run dev
   ```

2. Start the webhook dev server (in another terminal):
   ```bash
   npm run sanity:webhooks:dev
   ```

3. Test with curl:
   ```bash
   curl -X POST http://localhost:3001/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "_id": "test-id",
       "_type": "character",
       "slug": {"current": "test-character"},
       "translationHash": "abc123"
     }'
   ```

4. Check the logs to see the revalidation process

## Production Deployment

### Option A: ISR (Incremental Static Regeneration)

Use the `/api/revalidate` endpoint with your hosting provider's webhook support:

- **Vercel**: Webhooks work automatically
- **Netlify**: May need a serverless function
- **Custom VPS**: Deploy Next.js with `next start`

### Option B: Full Rebuild

Set `NEXT_BUILD_HOOK` to trigger a full site rebuild on content changes:

- **Netlify**: Build hook URL from Settings → Build & deploy → Build hooks
- **Vercel**: Deploy hook URL from Settings → Git → Deploy Hooks

### Option C: Hybrid

- Use ISR for content updates (fast)
- Use build hooks for schema changes or major updates (complete)

## Sanity Webhook Configuration Reference

Example webhook configuration JSON:

```json
{
  "name": "Content Revalidation",
  "url": "https://your-domain.com/api/revalidate",
  "on": ["create", "update", "delete"],
  "filter": "_type in [\"character\", \"weapon\", \"guide\"]",
  "projection": "{_id, _type, slug, translationHash, autoTranslatedLocales}",
  "httpMethod": "POST",
  "apiVersion": "2024-01-01",
  "headers": {
    "x-webhook-secret": "your-secret-key"
  }
}
```

## Troubleshooting

**Webhooks not firing:**
- Check Sanity webhook logs in the dashboard
- Verify the filter expression
- Ensure the URL is accessible

**Revalidation failing:**
- Check `WEBHOOK_SECRET` matches
- Verify paths exist in your app
- Check Next.js app logs

**Build hooks not working:**
- Verify the build hook URL
- Check build platform logs
- Ensure rate limits aren't exceeded

