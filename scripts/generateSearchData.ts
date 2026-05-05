#!/usr/bin/env ts-node

/**
 * Build-time script to generate optimized search data for production builds
 * This ensures search suggestions work even in static export mode
 */

import fs from 'fs';
import path from 'path';

interface SearchDataItem {
  _id: string;
  name: { en: string; vi: string };
  slug: { _type: 'slug'; current: string };
  _type: 'character' | 'weapon';
  image?: string;
  // Character fields
  role?: string;
  weapon?: string;
  rarity?: string;
  element?: string;
  splash?: string;
  // Weapon fields
  type?: string;
  description?: { en: string; vi: string };
}

interface SearchData {
  characters: SearchDataItem[];
  weapons: SearchDataItem[];
  generatedAt: string;
  version: string;
}

async function generateSearchData() {
  console.log('🔍 Generating optimized search data...');
  
  try {
    let characters: any[] = [];
    let weapons: any[] = [];

    // Check if Sanity is configured
    if (!process.env.SANITY_PROJECT_ID && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.log('⚠️  Sanity not configured, using fallback data from import files...');
      
      // Use fallback data from import files
      const [charactersImport, weaponsImport] = await Promise.all([
        import('../import/character_import.json'),
        import('../import/weapon_import.json')
      ]);
      
      characters = charactersImport.default;
      weapons = weaponsImport.default;
      
      console.log(`✅ Using fallback data: ${characters.length} characters and ${weapons.length} weapons`);
    } else {
      // Fetch data from Sanity
      console.log('📡 Fetching data from Sanity...');
      
      // Dynamic import to avoid configuration issues
      const { sanityClient } = await import('../src/lib/sanity');
      const { CHARACTERS_QUERY, WEAPONS_QUERY } = await import('../src/lib/queries');
      
      const [charactersData, weaponsData] = await Promise.all([
        sanityClient.fetch(CHARACTERS_QUERY),
        sanityClient.fetch(WEAPONS_QUERY)
      ]);

      characters = charactersData;
      weapons = weaponsData;
      console.log(`✅ Fetched ${characters.length} characters and ${weapons.length} weapons`);
    }

    // Transform data for search optimization
    const searchData: SearchData = {
      characters: characters.map((char: any) => ({
        _id: char._id,
        name: char.name,
        slug: char.slug,
        _type: 'character' as const,
        image: char.image,
        role: char.role,
        weapon: char.weapon,
        rarity: char.rarity,
        element: char.element,
        splash: char.splash
      })),
      weapons: weapons.map((weapon: any) => ({
        _id: weapon._id,
        name: weapon.name,
        slug: weapon.slug,
        _type: 'weapon' as const,
        image: weapon.image,
        type: weapon.type,
        rarity: weapon.rarity,
        description: weapon.description
      })),
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    // Create search index for faster lookups
    const searchIndex = {
      characters: searchData.characters.map(item => ({
        id: item._id,
        name: item.name.en.toLowerCase(),
        nameVi: item.name.vi.toLowerCase(),
        role: item.role?.toLowerCase() || '',
        element: item.element?.toLowerCase() || '',
        weapon: item.weapon?.toLowerCase() || ''
      })),
      weapons: searchData.weapons.map(item => ({
        id: item._id,
        name: item.name.en.toLowerCase(),
        nameVi: item.name.vi.toLowerCase(),
        type: item.type?.toLowerCase() || ''
      }))
    };

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '../src/lib/generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write search data
    const searchDataPath = path.join(outputDir, 'searchData.json');
    fs.writeFileSync(searchDataPath, JSON.stringify(searchData, null, 2));
    console.log(`📁 Written search data to ${searchDataPath}`);

    // Write search index
    const searchIndexPath = path.join(outputDir, 'searchIndex.json');
    fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2));
    console.log(`📁 Written search index to ${searchIndexPath}`);

    // Write TypeScript definitions
    const typesPath = path.join(outputDir, 'searchData.d.ts');
    const typesContent = `// Auto-generated search data types
export interface SearchDataItem {
  _id: string;
  name: { en: string; vi: string };
  slug: { _type: 'slug'; current: string };
  _type: 'character' | 'weapon';
  image?: string;
  role?: string;
  weapon?: string;
  rarity?: string;
  element?: string;
  splash?: string;
  type?: string;
  description?: { en: string; vi: string };
}

export interface SearchData {
  characters: SearchDataItem[];
  weapons: SearchDataItem[];
  generatedAt: string;
  version: string;
}

export interface SearchIndex {
  characters: Array<{
    id: string;
    name: string;
    nameVi: string;
    role: string;
    element: string;
    weapon: string;
  }>;
  weapons: Array<{
    id: string;
    name: string;
    nameVi: string;
    type: string;
  }>;
}
`;
    fs.writeFileSync(typesPath, typesContent);
    console.log(`📁 Written TypeScript definitions to ${typesPath}`);

    console.log('✅ Search data generation completed successfully!');
    console.log(`📊 Generated data for ${searchData.characters.length} characters and ${searchData.weapons.length} weapons`);
    
  } catch (error) {
    console.error('❌ Failed to generate search data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSearchData();
}

export { generateSearchData };
