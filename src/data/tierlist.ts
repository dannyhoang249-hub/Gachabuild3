import { getCharacters } from '@/lib/data';
import { Character } from '@/lib/data';

export const tierlist = {
  EX: ["berenica", "hilda", "truffle-and-filbert"],
  S: ["psyche", "tabethe", "yuming"],
  A: ["fina", "lynn", "outsider"]
};

// Helper function to get characters by tier
export async function getCharactersByTier(tier: keyof typeof tierlist): Promise<Character[]> {
  try {
    const characters = await getCharacters();
    return tierlist[tier]
      .map(id => characters.find(char => char.slug.current === id))
      .filter((char): char is NonNullable<typeof char> => char !== undefined);
  } catch (error) {
    return [];
  }
}

// Helper function to get all tiers
export function getAllTiers() {
  return Object.keys(tierlist) as (keyof typeof tierlist)[];
}
