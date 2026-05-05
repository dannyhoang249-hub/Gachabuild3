---
title: "GachaBuild3 - Project Overview & Architecture"
description: "Complete architecture overview of the Duet Night Abyss game wiki"
last_updated: "2025-10-27"
related_files: ["project-structure.md", "tech-stack.md", "data-flow.md"]
tags: ["architecture", "overview", "nextjs", "sanity", "docker"]
---

# GachaBuild3 - Project Overview & Architecture

**Project:** Duet Night Abyss Game Wiki  
**Domain:** https://duetnightabyss.gachabuild.com  
**Tech Stack:** Next.js 15, Sanity CMS, Docker, Nginx  
**Deployment:** VPS with Docker Compose + SSL

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                      │
│              (Port 80/443 - SSL Termination)                │
└────────────┬─────────────────────────────┬──────────────────┘
             │                             │
             │ /                           │ /studio
             ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Next.js Frontend      │   │  Sanity Studio (CMS)    │
│   Port: 3000            │   │  Port: 3333             │
│   Service: frontend     │   │  Service: sanity-studio │
│   Mode: Production      │   │  Mode: Static Build     │
└─────────────────────────┘   └─────────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────────────────────────────────┐
│              Sanity.io Cloud CMS                            │
│         Project ID: u9m27k7u                                │
│         Dataset: production                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Gachabuild3/
├── src/                          # Next.js application source
│   ├── app/                      # Next.js 15 App Router pages
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Utilities and Sanity client
│   └── data/                     # Static data
│
├── sanity/                       # Sanity Studio configuration
│   ├── schemas/                  # Content schemas (character, weapon, guide)
│   ├── actions/                  # Custom actions (translate, revalidate)
│   └── studio.tsx                # Studio entry point
│
├── public/                       # Static assets
│   ├── characters/               # Character images
│   └── weapons/                  # Weapon images
│
├── scripts/                      # Utility scripts
│   ├── i18n/                     # Translation scripts
│   └── assets/                   # Asset management
│
├── Dockerfile                    # Next.js frontend build
├── Dockerfile.studio             # Sanity Studio static build
├── docker-compose.production.yml # Production Docker Compose
├── nginx-ssl.conf                # Nginx reverse proxy config
├── sanity.config.ts              # Sanity Studio config (CRITICAL: basePath)
└── .env                          # Environment variables (not in git)
```

---

## 🔧 How It's Built

### Frontend (Next.js)

**Dockerfile:** Multi-stage build
- Stage 1: Install dependencies
- Stage 2: Build Next.js app
- Stage 3: Production runtime with standalone output

**Build Command:**
```bash
docker compose -f docker-compose.production.yml build frontend
```

**Key Settings:**
- Output: Standalone (optimized for Docker)
- Port: 3000
- Mode: Production

### Sanity Studio (CMS)

**Dockerfile.studio:** Multi-stage static build
- Stage 1 (builder): Node.js - builds static HTML/CSS/JS
- Stage 2 (runtime): Nginx Alpine - serves static files

**Build Command:**
```bash
docker compose -f docker-compose.production.yml build sanity-studio
```

**Key Settings:**
- Port: 3333
- Mode: Static build served by Nginx
- BasePath: `/studio` (CRITICAL for routing)

### Nginx Reverse Proxy

**Configuration:** nginx-ssl.conf
- SSL termination (Let's Encrypt certificates)
- Routes `/` → Frontend (port 3000)
- Routes `/studio` → Sanity Studio (port 3333)
- Security headers and optimizations

---

## 🚀 Deployment Process

### 1. Build Images
```bash
docker compose -f docker-compose.production.yml build
```

### 2. Start Services
```bash
docker compose -f docker-compose.production.yml up -d
```

### 3. Verify Deployment
```bash
# Check all services running
docker compose -f docker-compose.production.yml ps

# Test endpoints
curl -I https://duetnightabyss.gachabuild.com
curl -I https://duetnightabyss.gachabuild.com/studio
```

---

## 📊 Key Features

### ✅ Implemented Features
- **Multilingual Support:** English, Vietnamese, Japanese, Chinese
- **Character Database:** Complete character profiles with builds
- **Weapon Database:** Weapon stats and recommendations
- **Tier Lists:** Community-driven character rankings
- **Search System:** Fast character and weapon search
- **Responsive Design:** Mobile-first approach
- **SEO Optimized:** Bilingual meta tags and structured data
- **CMS Integration:** Sanity Studio for content management

### 🔄 Content Management
- **Sanity CMS:** Headless CMS for all dynamic content
- **Real-time Updates:** Content changes reflect immediately
- **Media Management:** Optimized image delivery
- **Version Control:** Content versioning and rollback

### 🌐 Internationalization
- **Static SEO:** Bilingual meta tags for all pages
- **Dynamic Content:** CMS-driven multilingual content
- **Language Routing:** Proper locale-based routing
- **Fallback System:** Graceful degradation for missing translations

---

##[object Object]ted Documentation

- **[Project Structure Details](./project-structure.md)** - Detailed file organization
- **[Tech Stack Overview](./tech-stack.md)** - Technologies and versions used
- **[Data Flow Diagram](./data-flow.md)** - How data moves through the system
- **[Setup Guide](../setup/README.md)** - Complete setup instructions
- **[Deployment Guide](../setup/deployment-guide.md)** - Platform-specific deployment

---

## 📈 Performance & Monitoring

### Build Metrics
- **Build Time:** ~3-5 minutes
- **Image Sizes:** Frontend (~200MB), Studio (~50MB)
- **Startup Time:** ~30 seconds for all services

### Runtime Performance
- **Page Load:** <2s first load, <500ms subsequent
- **SEO Score:** 95+ on all major pages
- **Mobile Performance:** 90+ Lighthouse score
- **Uptime:** 99.9% target with health checks

---

## 🔒 Security Features

- **SSL/TLS:** Let's Encrypt certificates with auto-renewal
- **Security Headers:** HSTS, CSP, X-Frame-Options
- **API Security:** Sanity token-based authentication
- **Container Security:** Non-root user, minimal attack surface
- **Environment Isolation:** Secrets managed via environment variables
