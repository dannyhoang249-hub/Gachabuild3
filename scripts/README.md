# Content and maintenance scripts

This directory contains scripts used to operate the GachaBuild content pipeline. Most scripts need valid Sanity credentials in `.env.local`; scripts that mutate CMS data should be run only after reviewing their source and testing against a non-production dataset.

## Available scripts

| Script | Purpose |
| --- | --- |
| `generateSearchData.ts` | Builds the local search index used by the guide. |
| `importBuildGuides.ts` | Imports build-guide content into Sanity. |
| `importWeaponsFromMD.ts` | Imports weapon content from Markdown files. |
| `migrateCharacterContent.ts` | Migrates character content to the current schema. |
| `translateCharacters.ts` | Translates character content through the configured provider. |
| `uploadCharacterImages.ts` | Uploads character images to Sanity. |
| `checkSanityData.ts` | Checks the CMS data used by the guide. |
| `checkRequiredFields.ts` | Reports required fields that are missing. |
| `checkWeapons.ts` / `verifyWeaponAvailability.ts` | Validates weapon data. |
| `exportSanityToCSV.ts` | Exports CMS content to CSV. |
| `fixMissingImages.ts`, `fixMissingKeys.ts`, `fixUnknownFields.ts` | Repairs targeted data issues. |
| `deleteAllWeapons.ts`, `deleteOldWeapons.ts` | Destructive maintenance scripts—review carefully before use. |
| `reset-vps.sh`, `setup-letsencrypt.sh` | Optional server-maintenance helpers for a self-hosted Docker deployment. |

## Running scripts

Use the npm commands listed in the root [`README.md`](../README.md), where available. For a script without an npm alias, run it explicitly with `tsx`:

```bash
npx tsx scripts/checkRequiredFields.ts
```

## Safe operating guidelines

1. Copy [`env.example`](../env.example) to `.env.local` and provide your own credentials. Do not commit local environment files.
2. Run validation or dry-run variants before running scripts that import, migrate, update, or delete content.
3. Back up the target Sanity dataset before any bulk operation.
4. Use generic deployment configuration for public forks—do not store VPS addresses, passwords, API tokens, or certificate files in this repository.

For Docker deployment, see the root [`README.md`](../README.md), [`docs/architecture/PROJECT_OVERVIEW.md`](../docs/architecture/PROJECT_OVERVIEW.md), and [`docs/SETUP_GUIDE.md`](../docs/SETUP_GUIDE.md).
