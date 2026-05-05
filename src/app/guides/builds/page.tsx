import { Metadata } from 'next';
import { getCharacters, getAllBuildGuidesMinimal } from '@/lib/data';
import BuildGuidesListClient from '@/components/BuildGuidesListClient';

export const metadata: Metadata = {
  title: 'Character Build Guides - Duet Night Abyss',
  description: 'AI-powered build recommendations for all characters with optimal weapon pairs, team compositions, and playstyle tips for Solo, Farm, and Boss modes.',
  keywords: 'Duet Night Abyss, DNA, build guides, character builds, weapon recommendations, team compositions, meta builds',
  openGraph: {
    title: 'Character Build Guides - Duet Night Abyss',
    description: 'AI-powered build recommendations with optimal weapon pairs and team compositions for all game modes.',
    type: 'website',
    url: 'https://duetnightabyss.gachabuild.com/guides/builds',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'Duet Night Abyss Build Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character Build Guides - Duet Night Abyss',
    description: 'AI-powered build recommendations with optimal weapon pairs and team compositions.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com/guides/builds',
  },
};

export default async function BuildGuidesListPage() {
  const [characters, buildGuides] = await Promise.all([
    getCharacters(),
    getAllBuildGuidesMinimal()
  ]);

  return <BuildGuidesListClient characters={characters} buildGuides={buildGuides} />;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

