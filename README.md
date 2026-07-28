# GachaBuild 3

### An open-source, CMS-powered web-guide starter for live-service gacha games

GachaBuild 3 is a production-oriented reference implementation for building game-guide websites that are useful to players and maintainable by content teams. The current deployment, **Duet Night Abyss Guide**, turns structured game data into searchable character pages, weapon pages, build recommendations, and mode-specific tier lists—without requiring developers to edit page copy for every update.

**[View the live guide](https://duetnightabyss.gachabuild.com)** · **[Open CMS Studio](https://studio.duetnightabyss.gachabuild.com)** · **[Read the setup guide](docs/SETUP_GUIDE.md)**

> **Project scope:** This repository is an implementation for Duet Night Abyss and a reusable foundation for similar gacha-game guides. It is not yet a fully productized multi-tenant CMS platform.

---

## Why I built it

Live-service games change frequently, while players need clear, current, and accessible information. Updating a traditional static guide can create a bottleneck between game-data research, writing, and publishing.

GachaBuild 3 addresses that problem by separating the **content workflow** from the **website code**:

- **Players** can browse focused guides, compare characters and weapons, filter information, and use tier lists tailored to gameplay modes.
- **Editors** can manage structured characters, weapons, and guides through Sanity Studio instead of changing React code.
- **Site owners** can deploy the frontend and CMS as Docker services behind Nginx, with SSL and content revalidation support.
- **Developers** can fork the source and adapt its schemas, design, data-import scripts, and deployment configuration to another game.

## What the guide includes

- **Character database** with detailed profiles, roles, elements, weapons, skills, and build recommendations.
- **Weapon database** with stats, effects, rarity, and recommended-character relationships.
- **Mode-based tier lists** for Farming, Party, and Boss play rather than a single oversimplified ranking.
- **Build-guide system** that connects character, weapon, and strategy content.
- **Search and filtering** to help players find relevant information quickly.
- **Internationalization foundation** for English and Vietnamese, with translation utilities designed for additional locales.
- **SEO features** including metadata, sitemap, robots rules, structured data, and canonical URLs.
- **CMS revalidation workflow** so publishing a content update can refresh relevant pages.

## Architecture

```text
                    ┌────────────────────────┐
                    │        Nginx           │
                    │  HTTPS / reverse proxy │
                    └───────────┬────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
 ┌────────────────────────┐           ┌────────────────────────┐
 │ Next.js 15 web guide   │           │ Sanity Studio CMS      │
 │ public player website  │           │ editor-facing UI       │
 └────────────┬───────────┘           └────────────┬───────────┘
              │                                    │
              └──────────────┬─────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │ Sanity Content Lake │
                  │ characters, weapons │
                  │ guides, build data  │
                  └─────────────────────┘
```

### Tech stack

| Layer | Technologies |
| --- | --- |
| Web application | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS |
| Content platform | Sanity CMS, GROQ, Sanity Studio |
| Search | Generated lightweight search index + API route |
| Deployment | Docker, Docker Compose, Nginx, SSL |
| Content operations | TypeScript import, validation, translation, asset, and CSV-export scripts |

## Content workflow

The core content types are defined in [`sanity/schemas`](sanity/schemas):

1. An editor creates or updates a **character**, **weapon**, or **guide** in Sanity Studio.
2. The frontend queries that structured content through GROQ.
3. A revalidation action/webhook refreshes the affected guide pages.
4. Players see the update on the public website without a source-code content change.

For teams moving existing research into the CMS, the repository also contains import and migration utilities in [`scripts/`](scripts/), including Markdown/CSV-oriented content tools and data checks.

## Run locally

### Prerequisites

- Node.js **18+** (Node 20 LTS recommended)
- npm
- A Sanity project and dataset

### 1. Install and configure

```bash
git clone https://github.com/dannyhoang249-hub/gacha-guide-cms.git
cd gacha-guide-cms
npm ci
cp env.example .env.local
```

Update `.env.local` with your own Sanity project configuration:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
WEBHOOK_SECRET=replace_with_a_long_random_secret
```

### 2. Start the website

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Start the CMS

In another terminal:

```bash
npm run studio
```

Open the local Studio URL shown by Sanity (normally [http://localhost:3333](http://localhost:3333)).

> Before using this as a new-game starter, replace the Duet Night Abyss project ID, dataset, domain names, branding, SEO metadata, and starter data with your own values. See [the setup guide](docs/SETUP_GUIDE.md) for the extended configuration workflow.

## Deploy with Docker

This repository includes Dockerfiles and Compose configurations for a VPS deployment with an Nginx reverse proxy.

```bash
# On your deployment host, after configuring environment variables
docker compose -f docker-compose.production.yml up -d --build

# Inspect running services
docker compose -f docker-compose.production.yml ps
```

For deployment assumptions, SSL configuration, and operational scripts, see:

- [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md)
- [`QUICK_DEPLOY_COMMANDS.md`](QUICK_DEPLOY_COMMANDS.md)
- [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md)

**Security note:** never commit `.env.local`, production API tokens, private keys, or TLS certificates. Configure secrets in the deployment environment or your CI/CD provider.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Next.js development server |
| `npm run build` | Create a production web build |
| `npm run lint` | Run ESLint |
| `npm run studio` | Run Sanity Studio locally |
| `npm run generate:search-data` | Regenerate local search data |
| `npm run check:sanity` | Validate selected CMS data |
| `npm run import:builds` | Import build-guide content |
| `npm run import:weapons` | Import weapon content from Markdown |
| `npm run export:csv` | Export CMS data to CSV |

Run `npm run` to view the full operational-script list.

## Repository map

```text
src/app/              Routes, pages, metadata, and API endpoints
src/components/       Guide UI, filters, navigation, tier-list components
src/lib/              Sanity client, queries, search, and i18n helpers
sanity/schemas/       CMS content models
sanity/actions/       Editor actions for translation, review, and revalidation
scripts/              Content import, migration, validation, and asset tools
docs/                 Setup, architecture, deployment, and feature documentation
docker-compose*.yml   Local and production container orchestration
```

## Engineering focus

This project demonstrates my ability to:

- translate a player-facing content problem into a maintainable product workflow;
- design structured CMS schemas and connect them to a typed frontend;
- build responsive, discoverable content experiences with Next.js;
- create practical operations tooling for imports, validation, localization, search, and assets; and
- deploy a multi-service web application with containers, reverse proxying, and HTTPS.

## Project status and next steps

The Duet Night Abyss guide is the active implementation. Planned improvements include stronger automated test coverage, CI checks, a cleaner game-configuration layer, and making the fork-to-new-game setup more streamlined.

## License

No license file is currently included. If you intend others to reuse or contribute to this repository, add a license (for example, MIT or Apache-2.0) and contribution guidelines before promoting it as open source.
