import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { documentActions } from './sanity/actions'

export default defineConfig({
  // Critical: workspace name must be 'default' for single workspace
  name: 'default',
  title: 'GachaBuild CMS',

  // IMPORTANT: Must be string literals for Vite to embed them
  projectId: 'u9m27k7u',
  dataset: 'production',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Characters')
              .child(
                S.documentTypeList('character')
                  .title('Characters')
                  .filter('_type == "character"')
              ),
            S.listItem()
              .title('Weapons')
              .child(
                S.documentTypeList('weapon')
                  .title('Weapons')
                  .filter('_type == "weapon"')
              ),
            S.listItem()
              .title('Guides')
              .child(
                S.documentTypeList('guide')
                  .title('Guides')
                  .filter('_type == "guide"')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['character', 'weapon', 'guide'].includes(listItem.getId()!)
            ),
          ])
    }),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  document: {
    actions: documentActions
  },
})
