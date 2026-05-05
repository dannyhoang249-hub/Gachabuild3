/**
 * Sanity CLI Configuration
 * This file ensures project settings are available during build
 */

import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u9m27k7u',
    dataset: 'production'
  }
})

