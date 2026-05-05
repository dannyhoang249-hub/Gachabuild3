---
title: "Technology Stack Details"
description: "Detailed breakdown of technologies, versions, and configurations used in GachaBuild3"
last_updated: "2025-10-27"
related_files: ["README.md", "project-structure.md"]
tags: ["tech-stack", "versions", "configuration"]
---

# Technology Stack Details

Complete breakdown of the technologies and configurations used in the GachaBuild3 project.

## 🏗️ Core Technologies

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### Content Management
- **Sanity CMS** - Headless CMS
  - Project ID: `u9m27k7u`
  - Dataset: `production`
  - Studio served as static build

### Deployment & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and SSL termination
- **Let's Encrypt** - SSL certificates with auto-renewal

##[object Object]Docker Configuration

### 3 Docker Containers

#### 1. Frontend Container
```yaml
frontend:
  image: Custom (built from Dockerfile)
  port: 3000 (internal)
  network: gachabuild-network
  restart: unless-stopped
  build: Multi-stage with standalone output
```

#### 2. Sanity Studio Container
```yaml
sanity-studio:
  image: Custom (Nginx + built Sanity files)
  port: 3333 (internal)
  network: gachabuild-network
  restart: unless-stopped
  build: Static build served by Nginx Alpine
```

#### 3. Nginx Reverse Proxy
```yaml
nginx:
  image: nginx:alpine
  ports: 80 (HTTP), 443 (HTTPS)
  ssl: Mounted from ./ssl/
  network: gachabuild-network
  restart: unless-stopped
```

## 🔧 Build Configuration

### Next.js Frontend Build

**Dockerfile:** Multi-stage build
- **Stage 1:** Install dependencies
- **Stage 2:** Build Next.js app
- **Stage 3:** Production runtime with standalone output

**Key Settings:**
```typescript
// next.config.ts
{
  output: 'standalone',  // Optimized for Docker
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }
}
```

### Sanity Studio Build

**Dockerfile.studio:** Multi-stage static build
- **Stage 1 (builder):** Node.js - builds static HTML/CSS/JS
- **Stage 2 (runtime):** Nginx Alpine - serves static files

**Critical Configuration:**
```typescript
// sanity.config.ts
export default defineConfig({
  basePath: '/studio',  // ⚠️ CRITICAL - must match nginx path!
  projectId: 'u9m27k7u',
  dataset: 'production',
  // ...
})
```

**Why Static Build:**
- ✅ No dev server host checking issues
- ✅ Fast, reliable nginx serving
- ✅ Production-ready
- ❌ DON'T use `sanity dev` in production!

## 🌐 Request Flow & Routing

```
User Request → Nginx (443) → Routes:
                              ├─ / → frontend:3000 (Next.js)
                              └─ /studio → sanity-studio:3333 (Static files)
```

### Nginx Configuration
- **SSL Termination:** Let's Encrypt certificates
- **Security Headers:** HSTS, XSS protection, etc.
- **Proxy Settings:** Optimized for Next.js and static files
- **Auto-redirect:** HTTP → HTTPS

## 🔒 Security Configuration

### SSL/TLS Setup
- **Certificates:** Let's Encrypt via Certbot
- **Location:** `/etc/letsencrypt/live/duetnightabyss.gachabuild.com/`
- **Mounted to:** `./ssl/` in project root
- **Auto-renewal:** Certbot handles it automatically

### Security Headers
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Environment Security
- `.env` file is git-ignored (never commit!)
- API tokens stored in environment variables only
- All traffic forced to HTTPS
- Sanity token-based authentication

## 📦 Package Management

### Frontend Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "@sanity/client": "latest",
  "tailwindcss": "latest"
}
```

### Sanity Studio Dependencies
```json
{
  "sanity": "^3.0.0",
  "@sanity/vision": "^3.0.0",
  "styled-components": "^6.0.0"
}
```

## 🔑 Environment Variables

**Required Variables:**
```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Additional features
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
WEBHOOK_SECRET=your-secret-here
```

**Location on VPS:** `/root/Gachabuild3/.env`

## 📊 Performance Characteristics

### Build Metrics
- **Build Time:** ~3-5 minutes (frontend), ~2-3 minutes (studio)
- **Image Sizes:** Frontend (~200MB), Studio (~50MB)
- **Startup Time:** ~30 seconds for all services

### Runtime Performance
- **Page Load:** <2s first load, <500ms subsequent
- **Container Resources:** Minimal footprint
- **Network:** Optimized with Nginx caching

## 🔄 Development vs Production

### Development
```bash
# Frontend
npm run dev  # Next.js dev server on :3000

# Sanity Studio
npm run studio  # Sanity dev server on :3333
```

### Production
```bash
# All services via Docker Compose
docker compose -f docker-compose.production.yml up -d
```

**Key Differences:**
- Production uses static Sanity build (not dev server)
- SSL termination at Nginx level
- Optimized Docker images
- Environment-specific configurations

## 🛠️ Build Tools & Scripts

### Available Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "studio": "sanity dev",
  "studio:build": "sanity build"
}
```

### Docker Commands
```bash
# Build all services
docker compose -f docker-compose.production.yml build

# Build specific service
docker compose -f docker-compose.production.yml build frontend
docker compose -f docker-compose.production.yml build sanity-studio

# Start all services
docker compose -f docker-compose.production.yml up -d
```

## ⚠️ Critical Configuration Notes

1. **Sanity Studio MUST use static build** - Never run `sanity dev` in production
2. **`basePath: '/studio'` is REQUIRED** in `sanity.config.ts`
3. **Always rebuild after config changes** - Restart alone won't pick up new configs
4. **Use `--no-cache` when debugging** - Ensures fresh build
5. **Environment variables** - Required for both build and runtime

## 🔗 Related Documentation

- **[Project Structure](./project-structure.md)** - File organization details
- **[Setup Guide](../setup/README.md)** - Initial setup instructions
- **[Deployment Guide](../setup/deployment-guide.md)** - Deployment procedures
- **[Maintenance Guide](../maintenance/README.md)** - Ongoing maintenance
