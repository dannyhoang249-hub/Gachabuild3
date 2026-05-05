import { Metadata } from 'next';
import WeaponsPageClient from './WeaponsPageClient';
import { getWeapons } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Weapon Database | Duet Night Abyss Character Guide | Cơ sở dữ liệu vũ khí DNA',
  description: 'Complete weapon database for Duet Night Abyss. Browse melee and range weapons with detailed stats, passive abilities, and tier rankings. | Cơ sở dữ liệu vũ khí hoàn chỉnh cho Duet Night Abyss. Duyệt vũ khí cận chiến và tầm xa với thống kê chi tiết, kỹ năng thụ động và xếp hạng.',
  keywords: 'Duet Night Abyss, weapons, weapon database, melee weapons, range weapons, weapon stats, weapon passive, DNA weapons, vũ khí DNA, cơ sở dữ liệu vũ khí, vũ khí cận chiến, vũ khí tầm xa, thống kê vũ khí, kỹ năng thụ động',
  openGraph: {
    title: 'Weapon Database | Duet Night Abyss Character Guide | Cơ sở dữ liệu vũ khí DNA',
    description: 'Complete weapon database for Duet Night Abyss. Browse melee and range weapons with detailed stats, passive abilities, and tier rankings.',
    type: 'website',
    url: 'https://duetnightabyss.gachabuild.com/weapons',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'Duet Night Abyss Weapon Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weapon Database | Duet Night Abyss Character Guide',
    description: 'Complete weapon database for Duet Night Abyss with detailed stats and tier rankings.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com/weapons',
  },
};

export default async function WeaponsPage() {
  const weapons = await getWeapons();
  
  return <WeaponsPageClient weapons={weapons} />;
}
