import { defineType, defineField } from 'sanity'

export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string', validation: Rule => Rule.required() },
        { name: 'vi', title: 'Vietnamese', type: 'string' },
        { name: 'jp', title: 'Japanese', type: 'string' },
        { name: 'zh', title: 'Chinese', type: 'string' }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Character Guide', value: 'character' },
          { title: 'Team Building', value: 'team' },
          { title: 'Combat', value: 'combat' },
          { title: 'Resources', value: 'resources' },
          { title: 'Advanced', value: 'advanced' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'vi', title: 'Vietnamese', type: 'text' },
        { name: 'jp', title: 'Japanese', type: 'text' },
        { name: 'zh', title: 'Chinese', type: 'text' }
      ]
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        { 
          name: 'en', 
          title: 'English', 
          type: 'array',
          of: [{ type: 'block' }]
        },
        { 
          name: 'vi', 
          title: 'Vietnamese', 
          type: 'array',
          of: [{ type: 'block' }]
        },
        { 
          name: 'jp', 
          title: 'Japanese', 
          type: 'array',
          of: [{ type: 'block' }]
        },
        { 
          name: 'zh', 
          title: 'Chinese', 
          type: 'array',
          of: [{ type: 'block' }]
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    // i18n metadata fields
    defineField({
      name: 'i18nReadyLocales',
      title: 'i18n Ready Locales',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Locales that have been verified by an editor',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Vietnamese', value: 'vi' },
          { title: 'Japanese', value: 'jp' },
          { title: 'Chinese', value: 'zh' }
        ]
      }
    }),
    defineField({
      name: 'autoTranslatedLocales',
      title: 'Auto-Translated Locales',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Locales filled by AI translation, pending review',
      options: {
        list: [
          { title: 'Vietnamese', value: 'vi' },
          { title: 'Japanese', value: 'jp' },
          { title: 'Chinese', value: 'zh' }
        ]
      }
    }),
    defineField({
      name: 'translationHash',
      title: 'Translation Hash',
      type: 'string',
      description: 'Hash of source content for change detection',
      readOnly: true
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Original source URL for data attribution'
    }),
    defineField({
      name: 'imageLicense',
      title: 'Image License',
      type: 'string',
      description: 'License information for images'
    }),
    defineField({
      name: 'imageAttribution',
      title: 'Image Attribution',
      type: 'text',
      description: 'Attribution text for images'
    }),
    defineField({
      name: 'coverCdn',
      title: 'Cover CDN',
      type: 'object',
      description: 'External CDN references for cover image',
      fields: [
        { name: 'cdnUrl', title: 'CDN URL', type: 'url' },
        { name: 'originalUrl', title: 'Original URL', type: 'url' },
        { name: 'localFile', title: 'Local File Path', type: 'string' }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
      media: 'coverImage'
    }
  }
})

