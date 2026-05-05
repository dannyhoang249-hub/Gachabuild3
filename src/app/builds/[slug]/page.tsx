import { notFound } from 'next/navigation';
import { getBuildGuideByCharacterSlug, getBuildGuideSlugs } from '@/lib/data';
import BuildGuideClient from '@/components/BuildGuideClient';
import type { Metadata } from 'next';

// Generate static params for all build guides
export async function generateStaticParams() {
  const slugs = await getBuildGuideSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const buildGuide = await getBuildGuideByCharacterSlug(slug);

  if (!buildGuide) {
    return {
      title: 'Build Guide Not Found',
    };
  }

  const characterName = buildGuide.character.name.en;

  return {
    title: `${characterName} Build Guide - Duet Night Abyss`,
    description: `Complete build guide for ${characterName} including optimal weapon pairs, team compositions, and playstyle tips for Solo, Farm, and Boss modes.`,
    openGraph: {
      title: `${characterName} Build Guide`,
      description: `Optimal builds and team compositions for ${characterName}`,
      images: buildGuide.character.image ? [buildGuide.character.image] : [],
    },
  };
}

interface BuildGuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BuildGuidePage({ params }: BuildGuidePageProps) {
  const { slug } = await params;
  const buildGuide = await getBuildGuideByCharacterSlug(slug);

  if (!buildGuide) {
    notFound();
  }

  return <BuildGuideClient buildGuide={buildGuide} />;
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

