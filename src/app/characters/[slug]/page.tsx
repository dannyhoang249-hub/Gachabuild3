import { notFound } from 'next/navigation';
import { getCharacterBySlug, getCharacterSlugs } from '@/lib/data';
import { generateMetadata } from './metadata';
import CharacterDetailClient from '@/components/CharacterDetailClient';

// Export metadata generation
export { generateMetadata };

// Generate static params for all characters
export async function generateStaticParams() {
  const slugs = await getCharacterSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

interface CharacterDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  return <CharacterDetailClient character={character} />;
}