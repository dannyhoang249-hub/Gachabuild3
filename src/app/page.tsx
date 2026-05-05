import { Metadata } from 'next';
import { Suspense } from 'react';
import TierListV2 from '@/components/TierListV2';
import StructuredData from '@/components/StructuredData';
import { getCharacters } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Duet Night Abyss Character Tier List - Mode-Based Rankings | Bảng xếp hạng nhân vật DNA',
  description: 'Complete Duet Night Abyss character tier list with mode-based rankings (Farming, Party, Boss). Find the best DNA characters optimized for each game mode. | Bảng xếp hạng nhân vật Duet Night Abyss hoàn chỉnh theo chế độ chơi. Tìm nhân vật DNA tốt nhất cho từng chế độ.',
  keywords: 'Duet Night Abyss, DNA, character tier list, tier rankings, farming tier list, boss tier list, party tier list, character guide, builds, strategies, vanguard, support, annihilator, DPS, gacha game, bảng xếp hạng nhân vật, hướng dẫn nhân vật, build nhân vật, chiến thuật, game gacha, tier list DNA',
  openGraph: {
    title: 'Duet Night Abyss Character Tier List - Mode-Based Rankings | Bảng xếp hạng nhân vật DNA',
    description: 'Complete Duet Night Abyss character tier list with mode-based rankings. Find the best DNA characters optimized for Farming, Party, and Boss modes.',
    type: 'website',
    url: 'https://duetnightabyss.gachabuild.com',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'Duet Night Abyss Character Tier List',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duet Night Abyss Character Tier List - Mode-Based Rankings',
    description: 'Complete character tier list with mode-based rankings for Farming, Party, and Boss modes.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com',
  },
};

// Loading fallback component
function TierListLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="h-12 bg-gray-200 rounded-lg w-2/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const characters = await getCharacters();

  return (
    <>
      <StructuredData type="tierlist" />
      <Suspense fallback={<TierListLoading />}>
        <TierListV2 characters={characters} />
      </Suspense>
    </>
  );
}
