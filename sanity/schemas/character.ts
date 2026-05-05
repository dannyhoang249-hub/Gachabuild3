import { defineType, defineField } from 'sanity'

export const character = defineType({
  name: 'character',
  title: 'Character',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
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
      options: { source: 'name.en' },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Vanguard', value: 'Vanguard' },
          { title: 'Support', value: 'Support' },
          { title: 'Annihilator', value: 'Annihilator' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'weaponCategory',
      title: 'Weapon Category',
      type: 'string',
      options: {
        list: [
          { title: 'Melee', value: 'Melee' },
          { title: 'Range', value: 'Range' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'weapon',
      title: 'Weapon Type',
      type: 'string',
      options: {
        list: [
          // Melee weapons
          { title: 'Katana', value: 'Katana' },
          { title: 'Sword', value: 'Sword' },
          { title: 'Polearm', value: 'Polearm' },
          { title: 'Whipsword', value: 'Whipsword' },
          { title: 'Greatsword', value: 'Greatsword' },
          // Range weapons
          { title: 'Shotgun', value: 'Shotgun' },
          { title: 'Dual Pistols', value: 'Dual Pistols' },
          { title: 'Assault Rifle', value: 'Assault Rifle' },
          { title: 'Bow', value: 'Bow' },
          { title: 'Grenade Launcher', value: 'Grenade Launcher' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'rarity',
      title: 'Rarity',
      type: 'string',
      options: {
        list: [
          { title: '3★', value: '3★' },
          { title: '4★', value: '4★' },
          { title: '5★', value: '5★' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'element',
      title: 'Element',
      type: 'string',
      options: {
        list: [
          { title: 'Fire', value: 'Fire' },
          { title: 'Water', value: 'Water' },
          { title: 'Earth', value: 'Earth' },
          { title: 'Wind', value: 'Wind' },
          { title: 'Light', value: 'Light' },
          { title: 'Dark', value: 'Dark' },
          { title: 'Ice', value: 'Ice' },
          { title: 'Lightning', value: 'Lightning' },
          { title: 'Anemo', value: 'Anemo' },
          { title: 'Psychic', value: 'Psychic' },
          { title: 'Moon', value: 'Moon' },
          { title: 'Sound', value: 'Sound' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'vi', title: 'Vietnamese', type: 'text' },
        { name: 'jp', title: 'Japanese', type: 'text' },
        { name: 'zh', title: 'Chinese', type: 'text' }
      ]
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the image'
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'splash',
      title: 'Splash Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the splash image'
        }
      ]
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'vi', title: 'Vietnamese', type: 'string' },
                { name: 'jp', title: 'Japanese', type: 'string' },
                { name: 'zh', title: 'Chinese', type: 'string' }
              ]
            },
            {
              name: 'description',
              title: 'Description',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'vi', title: 'Vietnamese', type: 'text' },
                { name: 'jp', title: 'Japanese', type: 'text' },
                { name: 'zh', title: 'Chinese', type: 'text' }
              ]
            },
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Active', value: 'active' },
                  { title: 'Ultimate', value: 'ultimate' },
                  { title: 'Passive', value: 'passive' },
                  { title: 'Intron', value: 'intron' }
                ]
              }
            },
            {
              name: 'subtype',
              title: 'Subtype',
              type: 'string',
              description: 'Optional subtype (e.g., "Switch Form: Ymir Mode")'
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Alternative text for the skill icon'
                }
              ]
            },
            // NEW: Stats table for skills
            {
              name: 'stats',
              title: 'Stats Table',
              type: 'array',
              description: 'Skill stats with Lv.1 and Lv.Max values',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'stat', title: 'Stat Name', type: 'string', validation: Rule => Rule.required() },
                    { name: 'lv1', title: 'Lv.1 Value', type: 'string' },
                    { name: 'lvMax', title: 'Lv.Max Value', type: 'string' },
                    { name: 'notes', title: 'Notes (optional)', type: 'string', description: 'e.g., "channeled", "on hit", "swordwave"' }
                  ],
                  preview: {
                    select: {
                      title: 'stat',
                      subtitle: 'lv1'
                    }
                  }
                }
              ]
            },
            // Legacy fields (kept for backward compatibility)
            {
              name: 'cost',
              title: 'Cost (Legacy)',
              type: 'string'
            },
            {
              name: 'skillDMG',
              title: 'Skill DMG (Legacy)',
              type: 'text'
            },
            {
              name: 'duration',
              title: 'Duration (Legacy)',
              type: 'string'
            },
            {
              name: 'range',
              title: 'Range (Legacy)',
              type: 'string'
            },
            {
              name: 'misc',
              title: 'Misc (Legacy)',
              type: 'text'
            },
            {
              name: 'level',
              title: 'Level',
              type: 'number',
              description: 'For Intron skills, the level number'
            }
          ]
        }
      ]
    }),
    // Profile information (English only for now)
    defineField({
      name: 'profile',
      title: 'Profile',
      type: 'object',
      fields: [
        { name: 'gender', title: 'Gender', type: 'string' },
        { name: 'birthplace', title: 'Birthplace', type: 'string' },
        { name: 'birthday', title: 'Birthday', type: 'string' },
        { name: 'allegiance', title: 'Allegiance', type: 'string' }
      ]
    }),
    // Character traits list
    defineField({
      name: 'traits',
      title: 'Traits',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'traitItem',
          title: 'Trait',
          fields: [
            {
              name: 'name',
              title: 'Trait Name',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'vi', title: 'Vietnamese', type: 'string' }
              ]
            },
            {
              name: 'effect',
              title: 'Effect',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'vi', title: 'Vietnamese', type: 'text' }
              ]
            }
          ],
          preview: {
            select: {
              title: 'name.en',
              subtitle: 'effect.en'
            }
          }
        }
      ]
    }),
    // Stats table (top-level, for character stats)
    defineField({
      name: 'stats',
      title: 'Character Stats',
      type: 'array',
      description: 'Character stat progression table',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'stat', title: 'Stat Name', type: 'string' },
            { name: 'lv1', title: 'Lv.1 Value', type: 'string' },
            { name: 'lvMax', title: 'Lv.Max Value', type: 'string' }
          ],
          preview: {
            select: {
              title: 'stat',
              subtitle: 'lv1'
            }
          }
        }
      ]
    }),
    // Base stats table rows (legacy field, kept for backward compatibility)
    defineField({
      name: 'baseStats',
      title: 'Base Stats (Legacy)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'stat', title: 'Stat', type: 'string' },
            { name: 'lv1', title: 'Lv.1', type: 'string' },
            { name: 'lvMax', title: 'Lv.Max', type: 'string' }
          ]
        }
      ]
    }),
    // Passive upgrades rows
    defineField({
      name: 'passiveUpgrades',
      title: 'Passive Upgrades',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'passiveUpgradeRow',
          title: 'Passive Upgrade',
          fields: [
            {
              name: 'upgrade',
              title: 'Upgrade',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'vi', title: 'Vietnamese', type: 'string' }
              ]
            },
            {
              name: 'value',
              title: 'Value',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'vi', title: 'Vietnamese', type: 'string' }
              ]
            }
          ],
          preview: {
            select: {
              title: 'upgrade.en',
              subtitle: 'value.en'
            }
          }
        }
      ]
    }),

    // NEW: Intron levels
    defineField({
      name: 'intron',
      title: 'Intron Levels',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'intronLevel',
          title: 'Intron Level',
          fields: [
            {
              name: 'level',
              title: 'Level',
              type: 'number',
              validation: Rule => Rule.required().min(1).max(6)
            },
            {
              name: 'effect',
              title: 'Effect',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'vi', title: 'Vietnamese', type: 'text' }
              ]
            }
          ],
          preview: {
            select: {
              level: 'level',
              effect: 'effect.en'
            },
            prepare({ level, effect }) {
              return {
                title: `Level ${level}`,
                subtitle: effect
              }
            }
          }
        }
      ]
    }),

    defineField({
      name: 'buildRecommendation',
      title: 'Build Recommendation',
      type: 'object',
      fields: [
        // NEW: Multilingual text fields for build guide sections
        {
          name: 'roleOverview',
          title: 'Role Overview (Optional)',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        {
          name: 'teamComposition',
          title: 'Team Composition',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        {
          name: 'recommendedWeapons',
          title: 'Recommended Weapons',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        {
          name: 'recommendedArtifacts',
          title: 'Recommended Artifacts',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        {
          name: 'statPriority',
          title: 'Stat Priority',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        {
          name: 'demonWedges',
          title: 'Demon Wedges',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        {
          name: 'teamRecommendations',
          title: 'Team Recommendations (Optional)',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'vi', title: 'Vietnamese', type: 'text' }
          ]
        },
        // NEW: Pros and Cons arrays (simple string arrays)
        {
          name: 'pros',
          title: 'Pros',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List of character strengths'
        },
        {
          name: 'cons',
          title: 'Cons',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List of character weaknesses'
        },
        // LEGACY FIELDS (kept for backward compatibility)
        {
          name: 'weapons',
          title: 'Recommended Weapons (Legacy)',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'artifacts',
          title: 'Recommended Artifacts (Legacy)',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'statPriorityLegacy',
          title: 'Stat Priority (Legacy)',
          type: 'array',
          of: [{ type: 'string' }]
        },
        // Optional team composition (non-breaking)
        {
          name: 'team',
          title: 'Team Composition (Legacy)',
          type: 'object',
          fields: [
            { name: 'main', title: 'Main', type: 'object', fields: [
              { name: 'name', title: 'Name', type: 'string' },
              { name: 'meleeWeapon', title: 'Melee Weapon', type: 'string' },
              { name: 'rangedWeapon', title: 'Ranged Weapon', type: 'string' },
            ]},
            { name: 'partner1', title: 'Partner 1', type: 'object', fields: [
              { name: 'name', title: 'Name', type: 'string' },
              { name: 'meleeWeapon', title: 'Melee Weapon', type: 'string' },
              { name: 'rangedWeapon', title: 'Ranged Weapon', type: 'string' },
            ]},
            { name: 'partner2', title: 'Partner 2', type: 'object', fields: [
              { name: 'name', title: 'Name', type: 'string' },
              { name: 'meleeWeapon', title: 'Melee Weapon', type: 'string' },
              { name: 'rangedWeapon', title: 'Ranged Weapon', type: 'string' },
            ]},
          ]
        },
        // Optional Demond Wedges block (Legacy)
        {
          name: 'demondWedges',
          title: 'Demond Wedges (Legacy)',
          type: 'object',
          fields: [
            { name: 'setName', title: 'Set Name', type: 'string' },
            { name: 'slots', title: 'Slots', type: 'array', of: [{ type: 'string' }] },
            { name: 'attributeBoosts', title: 'Attribute Boosts', type: 'array', of: [{
              type: 'object',
              fields: [
                { name: 'stat', title: 'Stat', type: 'string' },
                { name: 'value', title: 'Value', type: 'string' },
              ]
            }]},
            { name: 'notes', title: 'Notes', type: 'text' }
          ]
        }
      ]
    }),
    // Legacy alias for buildRecommendation (for backward compatibility)
    defineField({
      name: 'build',
      title: 'Build (Legacy - use buildRecommendation instead)',
      type: 'object',
      fields: [
        {
          name: 'weapons',
          title: 'Recommended Weapons',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'artifacts',
          title: 'Recommended Artifacts',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'statPriority',
          title: 'Stat Priority',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    }),
    defineField({
      name: 'recommendedWeapons',
      title: 'Recommended Weapons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'slug', title: 'Slug', type: 'string' },
            {
              name: 'priority',
              title: 'Priority',
              type: 'string',
              options: {
                list: [
                  { title: 'High', value: 'High' },
                  { title: 'Medium', value: 'Medium' },
                  { title: 'Low', value: 'Low' }
                ]
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'synergy',
      title: 'Team Synergy',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'partner', title: 'Partner', type: 'string' },
            {
              name: 'reason',
              title: 'Reason',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'vi', title: 'Vietnamese', type: 'text' },
                { name: 'jp', title: 'Japanese', type: 'text' },
                { name: 'zh', title: 'Chinese', type: 'text' }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'string' },
            { name: 'vi', title: 'Vietnamese', type: 'string' },
            { name: 'jp', title: 'Japanese', type: 'string' },
            { name: 'zh', title: 'Chinese', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'string' },
            { name: 'vi', title: 'Vietnamese', type: 'string' },
            { name: 'jp', title: 'Japanese', type: 'string' },
            { name: 'zh', title: 'Chinese', type: 'string' }
          ]
        }
      ]
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
      name: 'portraitCdn',
      title: 'Portrait CDN',
      type: 'object',
      description: 'External CDN references for portrait image',
      fields: [
        { name: 'cdnUrl', title: 'CDN URL', type: 'url' },
        { name: 'originalUrl', title: 'Original URL', type: 'url' },
        { name: 'localFile', title: 'Local File Path', type: 'string' }
      ]
    }),
    defineField({
      name: 'splashCdn',
      title: 'Splash CDN',
      type: 'object',
      description: 'External CDN references for splash image',
      fields: [
        { name: 'cdnUrl', title: 'CDN URL', type: 'url' },
        { name: 'originalUrl', title: 'Original URL', type: 'url' },
        { name: 'localFile', title: 'Local File Path', type: 'string' }
      ]
    })
  ],
  preview: {
    select: {
      title: 'name.en',
      subtitle: 'role',
      media: 'image'
    }
  }
})
