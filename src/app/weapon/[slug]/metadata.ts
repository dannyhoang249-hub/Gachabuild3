import { Metadata } from 'next';
import { getWeaponBySlug } from '@/lib/data';

interface GenerateMetadataProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const weapon = await getWeaponBySlug(slug);

  if (!weapon) {
    return {
      title: 'Weapon Not Found',
      description: 'The requested weapon could not be found.',
    };
  }

  const title = `${weapon.name.en} | Duet Night Abyss Weapon Guide`;
  const description = weapon.description?.en
    ? `${weapon.name.en} - ${weapon.type} weapon in Duet Night Abyss. ${weapon.description.en.substring(0, 150)}...`
    : `${weapon.name.en} - ${weapon.type} weapon in Duet Night Abyss.`;

  return {
    title,
    description,
    keywords: `Duet Night Abyss, ${weapon.name.en}, ${weapon.type}, ${weapon.rarity}, weapon guide, weapon stats, weapon passive, DNA weapons`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: weapon.image || 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
          width: 400,
          height: 400,
          alt: weapon.name.en,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [weapon.image || 'https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
    },
  };
}






