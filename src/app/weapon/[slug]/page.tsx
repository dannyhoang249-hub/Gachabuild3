import { notFound } from 'next/navigation';
import { getWeaponBySlug, getWeaponSlugs } from '@/lib/data';
import { generateMetadata } from './metadata';
import WeaponDetailClient from '@/components/WeaponDetailClient';

// Export metadata generation
export { generateMetadata };

// Generate static params for all weapons
export async function generateStaticParams() {
  const slugs = await getWeaponSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

interface WeaponDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WeaponDetailPage({ params }: WeaponDetailPageProps) {
  const { slug } = await params;
  const weapon = await getWeaponBySlug(slug);

  if (!weapon) {
    notFound();
  }

  return <WeaponDetailClient weapon={weapon} />;
}






