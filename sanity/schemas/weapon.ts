import { defineType, defineField } from 'sanity'

export const weapon = defineType({
  name: 'weapon',
  title: 'Weapon',
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
      name: 'category',
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
      name: 'type',
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
          { title: 'Dual Blades', value: 'Dual Blades' },
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
      name: 'element',
      title: 'Element',
      type: 'string',
      options: {
        list: [
          { title: 'Neutral', value: 'Neutral' },
          { title: 'Pyro', value: 'Pyro' },
          { title: 'Hydro', value: 'Hydro' },
          { title: 'Lumino', value: 'Lumino' },
          { title: 'Electro', value: 'Electro' },
          { title: 'Anemo', value: 'Anemo' },
          { title: 'Umbro', value: 'Umbro' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'damageType',
      title: 'Damage Type',
      type: 'string',
      options: {
        list: [
          { title: 'Spike', value: 'Spike' },
          { title: 'Slash', value: 'Slash' },
          { title: 'Smash', value: 'Smash' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'rarity',
      title: 'Rarity (Legacy - Optional)',
      type: 'string',
      description: 'Legacy field - weapons do not use rarity system',
      options: {
        list: [
          { title: 'R', value: 'R' },
          { title: 'SR', value: 'SR' },
          { title: 'SSR', value: 'SSR' }
        ]
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      description: 'Weapon lore/flavor text',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'vi', title: 'Vietnamese', type: 'text' },
        { name: 'jp', title: 'Japanese', type: 'text' },
        { name: 'zh', title: 'Chinese', type: 'text' }
      ]
    }),
    defineField({
      name: 'passive',
      title: 'Passive Effect (Legacy)',
      type: 'object',
      description: 'Legacy field - use refinementSkill instead',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'vi', title: 'Vietnamese', type: 'text' },
        { name: 'jp', title: 'Japanese', type: 'text' },
        { name: 'zh', title: 'Chinese', type: 'text' }
      ]
    }),
    defineField({
      name: 'stats',
      title: 'Stats (Legacy)',
      type: 'object',
      description: 'Legacy field - use baseStats instead',
      fields: [
        { name: 'attack', title: 'Attack', type: 'number' },
        { name: 'health', title: 'Health', type: 'number' },
        { name: 'defense', title: 'Defense', type: 'number' },
        { name: 'critRate', title: 'Crit Rate', type: 'number' },
        { name: 'critDamage', title: 'Crit Damage', type: 'number' }
      ]
    }),
    // Refinement Skill (R1-R6)
    defineField({
      name: 'refinementSkill',
      title: 'Refinement Skill',
      type: 'object',
      description: 'Weapon refinement skill with R1-R6 scaling values',
      fields: [
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
        { name: 'r1', title: 'R1 Values', type: 'array', of: [{ type: 'string' }] },
        { name: 'r2', title: 'R2 Values', type: 'array', of: [{ type: 'string' }] },
        { name: 'r3', title: 'R3 Values', type: 'array', of: [{ type: 'string' }] },
        { name: 'r4', title: 'R4 Values', type: 'array', of: [{ type: 'string' }] },
        { name: 'r5', title: 'R5 Values', type: 'array', of: [{ type: 'string' }] },
        { name: 'r6', title: 'R6 Values', type: 'array', of: [{ type: 'string' }] }
      ]
    }),
    // Base Stats
    defineField({
      name: 'baseStats',
      title: 'Base Stats',
      type: 'object',
      description: 'Weapon base stats at Lv.1 and Lv.MAX',
      fields: [
        // Primary ATK stats (one will be populated based on damageType)
        { name: 'spikeAtkLv1', title: 'Spike ATK Lv.1', type: 'number' },
        { name: 'spikeAtkLvMax', title: 'Spike ATK Lv.MAX', type: 'number' },
        { name: 'slashAtkLv1', title: 'Slash ATK Lv.1', type: 'number' },
        { name: 'slashAtkLvMax', title: 'Slash ATK Lv.MAX', type: 'number' },
        { name: 'smashAtkLv1', title: 'Smash ATK Lv.1', type: 'number' },
        { name: 'smashAtkLvMax', title: 'Smash ATK Lv.MAX', type: 'number' },
        // Universal stats
        { name: 'critChance', title: 'CRIT Chance (%)', type: 'number' },
        { name: 'critDamage', title: 'CRIT Damage (%)', type: 'number' },
        { name: 'atkSpeed', title: 'ATK Speed', type: 'number' },
        { name: 'triggerProbability', title: 'Trigger Probability (%)', type: 'number' },
        // Ranged-only stats
        { name: 'multishot', title: 'Multishot', type: 'number' },
        { name: 'magCapacity', title: 'Mag Capacity', type: 'number' },
        { name: 'maxAmmo', title: 'Max Ammo', type: 'number' },
        { name: 'ammoConversionRate', title: 'Ammo Conversion Rate', type: 'number' },
        { name: 'projectileExplosionRange', title: 'Projectile Explosion Range', type: 'number' }
      ]
    }),
    // Motion Values
    defineField({
      name: 'motionValues',
      title: 'Motion Values',
      type: 'object',
      description: 'Motion multipliers for attacks (stored as key-value pairs)',
      fields: [],
      options: {
        collapsible: true,
        collapsed: false
      }
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
          description: 'Alternative text for the weapon image'
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'recommendedCharacters',
      title: 'Recommended Characters',
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
      name: 'imageCdn',
      title: 'Image CDN',
      type: 'object',
      description: 'External CDN references for weapon image',
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
      subtitle: 'type',
      media: 'image'
    }
  }
})
