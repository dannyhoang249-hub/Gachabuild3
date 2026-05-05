import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Duet Night Abyss Patch Updates | Cập nhật phiên bản DNA',
  description: 'Stay updated with the latest Duet Night Abyss patches, balance changes, and new content updates. Track game changes and improvements. | Cập nhật các bản vá mới nhất của Duet Night Abyss, thay đổi cân bằng và nội dung mới.',
  keywords: 'Duet Night Abyss patch, DNA updates, game patches, balance changes, new content, patch notes, cập nhật DNA, bản vá game, thay đổi cân bằng, nội dung mới',
  openGraph: {
    title: 'Duet Night Abyss Patch Updates | Cập nhật phiên bản DNA',
    description: 'Stay updated with the latest Duet Night Abyss patches, balance changes, and new content updates.',
    type: 'website',
    url: 'https://duetnightabyss.gachabuild.com/patch',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'Duet Night Abyss Patch Updates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duet Night Abyss Patch Updates',
    description: 'Stay updated with the latest Duet Night Abyss patches and balance changes.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com/patch',
  },
};

export default function PatchPage() {
  return (
    <>
      <StructuredData type="website" />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Patch Updates | Cập nhật phiên bản
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Stay updated with the latest game patches, balance changes, and new content. Coming soon! | Cập nhật các bản vá mới nhất, thay đổi cân bằng và nội dung mới. Sắp ra mắt!
          </p>
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-8 max-w-md mx-auto hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Coming Soon | Sắp ra mắt
          </h2>
          <p className="text-slate-300">
            We&apos;re working on a comprehensive patch tracking system. Stay tuned for the latest updates! | Chúng tôi đang phát triển hệ thống theo dõi bản vá toàn diện. Hãy chờ đợi các cập nhật mới nhất!
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
