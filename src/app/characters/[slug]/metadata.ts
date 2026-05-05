import { Metadata } from 'next';
import { getCharacterBySlug } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) {
    return {
      title: 'Character Not Found - Duet Night Abyss',
      description: 'The requested character could not be found.',
    };
  }

  // Default to English for server-side rendering
  const characterName = character.name.en;
  
  const title = `${characterName} Build Guide - Duet Night Abyss Character Guide`;
  const description = `Complete ${characterName} build guide for Duet Night Abyss. Best weapons, artifacts, skills, and team compositions for ${character.role} ${characterName}. Expert DNA character guide.`;
  const keywords = `${characterName}, Duet Night Abyss, DNA, ${character.role}, ${character.weapon}, build guide, character guide, tier list, gacha game`;

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'en_US',
      url: `https://duetnightabyss.gachabuild.com/characters/${slug}`,
      siteName: 'Duet Night Abyss Guide Hub',
      images: [
        {
          url: character.splash || character.image || 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
          width: 1200,
          height: 630,
          alt: `${characterName} - Duet Night Abyss Character`,
        },
      ],
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      authors: ['Duet Night Abyss Guide'],
      section: 'Character Guide',
      tags: [characterName, 'Duet Night Abyss', character.role, character.weapon],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [character.splash || character.image || 'https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
      creator: '@DuetNightAbyss',
      site: '@DuetNightAbyss',
    },
    alternates: {
      canonical: `https://duetnightabyss.gachabuild.com/characters/${slug}`,
      languages: {
        'en': `https://duetnightabyss.gachabuild.com/characters/${slug}`,
        'vi': `https://duetnightabyss.gachabuild.com/vi/characters/${slug}`,
      },
    },
  };
}
