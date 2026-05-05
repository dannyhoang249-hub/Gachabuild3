import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Duet Night Abyss Game Guides | Hướng dẫn chơi DNA',
  description: 'Comprehensive guides for Duet Night Abyss including character builds, team compositions, and game strategies. | Hướng dẫn toàn diện cho Duet Night Abyss bao gồm build nhân vật, đội hình và chiến thuật game.',
  keywords: 'Duet Night Abyss, DNA, game guides, character builds, team composition, strategies, tips, hướng dẫn chơi DNA, build nhân vật, đội hình, chiến thuật game, mẹo chơi',
  openGraph: {
    title: 'Duet Night Abyss Game Guides | Hướng dẫn chơi DNA',
    description: 'Comprehensive guides for Duet Night Abyss including character builds, team compositions, and game strategies.',
    type: 'website',
    url: 'https://duetnightabyss.gachabuild.com/guides',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'Duet Night Abyss Game Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duet Night Abyss Game Guides | Hướng dẫn chơi DNA',
    description: 'Comprehensive guides for Duet Night Abyss including character builds, team compositions, and game strategies.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com/guides',
  },
};

export default function GuidesPage() {
  return (
    <main className="py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Game Guides | Hướng dẫn chơi game
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive guides for Duet Night Abyss including character builds, team compositions, and game strategies. | Hướng dẫn toàn diện cho Duet Night Abyss bao gồm build nhân vật, đội hình và chiến thuật game.
        </p>
      </header>

      <section className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <article className="professional-card p-6">
            <h2 className="text-heading-2 mb-4">Build Guides</h2>
            <p className="text-body text-gray-700 mb-4">
              AI-powered build recommendations with optimal weapon pairs and team compositions for all game modes.
            </p>
            <Link href="/guides/builds" className="btn-primary">
              View Build Guides
            </Link>
          </article>

          <article className="professional-card p-6">
            <h2 className="text-heading-2 mb-4">Character Database</h2>
            <p className="text-body text-gray-700 mb-4">
              Detailed information for each character including stats, skills, and abilities.
            </p>
            <Link href="/characters" className="btn-primary">
              View Characters
            </Link>
          </article>

          <article className="professional-card p-6">
            <h2 className="text-heading-2 mb-4">Team Compositions</h2>
            <p className="text-body text-gray-700 mb-4">
              Learn about effective team synergies and composition strategies for different game modes.
            </p>
            <Link href="/tier-list" className="btn-primary">
              View Tier List
            </Link>
          </article>

          <article className="professional-card p-6">
            <h2 className="text-heading-2 mb-4">Beginner&apos;s Guide</h2>
            <p className="text-body text-gray-700 mb-4">
              New to Duet Night Abyss? Start here with our comprehensive beginner&apos;s guide.
            </p>
            <div className="btn-secondary">
              Coming Soon
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}