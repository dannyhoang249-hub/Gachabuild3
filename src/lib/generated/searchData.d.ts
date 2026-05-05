// Auto-generated search data types
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
