# Documentation Reorganization Strategy

## Current Analysis

### Large Files Identified (>400 lines):
- `docs/SETUP_GUIDE.md` (472 lines) - Setup and deployment instructions
- `PROJECT_OVERVIEW.md` (470 lines) - Architecture and project structure
- `docs/asset-storage.md` (465 lines) - Asset storage system documentation
- `I18N_AND_ASSETS_README.md` (462 lines) - Internationalization system
- `HOW_TO_ADD_ENVIRONMENT_VARIABLES.md` (419 lines) - Environment configuration
- `docs/i18n-system.md` (408 lines) - i18n implementation details

## Reorganization Plan

### 1. New Directory Structure
```
docs/
├── setup/
│   ├── README.md                    # Overview and quick start
│   ├── environment-setup.md         # Environment variables
│   ├── deployment-guide.md          # Deployment instructions
│   ├── ssl-setup.md                 # SSL configuration
│   └── troubleshooting.md           # Common issues
├── architecture/
│   ├── README.md                    # System overview
│   ├── project-structure.md         # File organization
│   ├── tech-stack.md                # Technologies used
│   └── data-flow.md                 # How data flows
├── features/
│   ├── i18n/
│   │   ├── README.md                # i18n overview
│   │   ├── setup.md                 # Setup instructions
│   │   ├── translation-api.md       # API integration
│   │   └── troubleshooting.md       # Common issues
│   ├── assets/
│   │   ├── README.md                # Asset system overview
│   │   ├── storage-setup.md         # R2/B2 configuration
│   │   ├── migration.md             # Asset migration
│   │   └── cdn-setup.md             # CDN configuration
│   └── search/
│       ├── README.md                # Search system
│       └── implementation.md        # Technical details
├── deployment/
│   ├── README.md                    # Deployment overview
│   ├── vps-setup.md                 # VPS deployment
│   ├── docker-setup.md              # Docker configuration
│   └── monitoring.md                # Health checks
└── maintenance/
    ├── README.md                    # Maintenance overview
    ├── updates.md                   # Update procedures
    └── backup.md                    # Backup strategies
```

### 2. Naming Convention
- **README.md**: Overview and navigation for each directory
- **{feature}-setup.md**: Setup and configuration instructions
- **{feature}-guide.md**: Step-by-step guides
- **{feature}-troubleshooting.md**: Common issues and solutions
- **{feature}-api.md**: API documentation and integration

### 3. File Size Limits
- Maximum 400 lines per file
- Prefer 200-300 lines for optimal IDE performance
- Split complex topics into logical sections

### 4. Content Preservation
- All original content will be preserved
- Cross-references will be updated
- Timestamps and authorship maintained where present

### 5. Metadata Headers
Each file will include:
```markdown
---
title: "File Title"
description: "Brief description"
last_updated: "YYYY-MM-DD"
related_files: ["file1.md", "file2.md"]
tags: ["tag1", "tag2"]
---
```

## Implementation Steps

1. Create new directory structure
2. Split large files into focused modules
3. Add consistent formatting and navigation
4. Create master index file
5. Update cross-references
6. Add metadata headers
7. Create maintenance templates
8. Verify content preservation
