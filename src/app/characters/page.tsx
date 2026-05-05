import { Metadata } from 'next';
import CharactersPageClient from './CharactersPageClient';
import StructuredData from '@/components/StructuredData';
import { getCharacters } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Duet Night Abyss Character Database | Cơ sở dữ liệu nhân vật DNA',
  description: 'Complete Duet Night Abyss character database with detailed stats, builds, and strategies. Filter by role, element, and weapon type to find your perfect team composition. | Cơ sở dữ liệu nhân vật Duet Night Abyss hoàn chỉnh với thống kê chi tiết, build và chiến thuật. Lọc theo vai trò, nguyên tố và loại vũ khí để tìm đội hình hoàn hảo.',
  keywords: 'Duet Night Abyss, DNA, character database, character guide, builds, strategies, vanguard, support, annihilator, gacha game, character stats, team composition, cơ sở dữ liệu nhân vật, hướng dẫn nhân vật, build nhân vật, chiến thuật, thống kê nhân vật, đội hình',
  openGraph: {
    title: 'Duet Night Abyss Character Database | Cơ sở dữ liệu nhân vật DNA',
    description: 'Complete Duet Night Abyss character database with detailed stats, builds, and strategies. Filter by role, element, and weapon type.',
    type: 'website',
    url: 'https://duetnightabyss.gachabuild.com/characters',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'Duet Night Abyss Character Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duet Night Abyss Character Database | Cơ sở dữ liệu nhân vật DNA',
    description: 'Complete Duet Night Abyss character database with detailed stats, builds, and strategies.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com/characters',
  },
};

export default async function CharactersPage() {
  const characters = await getCharacters();
  
  return (
    <>
      <StructuredData type="character" />
      <CharactersPageClient characters={characters} />
    </>
  );
}
