import { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'GachaBuild Setup Guide | Hướng dẫn cài đặt GachaBuild',
  description: 'Complete setup guide for GachaBuild Duet Night Abyss project. Configure Sanity CMS, import characters and weapons data. | Hướng dẫn cài đặt hoàn chỉnh cho dự án GachaBuild Duet Night Abyss. Cấu hình Sanity CMS, nhập dữ liệu nhân vật và vũ khí.',
  keywords: 'GachaBuild setup, Duet Night Abyss setup, Sanity CMS configuration, character import, weapon import, DNA setup guide, cài đặt GachaBuild, hướng dẫn cài đặt Duet Night Abyss, cấu hình Sanity CMS, nhập dữ liệu nhân vật',
  openGraph: {
    title: 'GachaBuild Setup Guide | Hướng dẫn cài đặt GachaBuild',
    description: 'Complete setup guide for GachaBuild Duet Night Abyss project. Configure Sanity CMS and import game data.',
    type: 'article',
    url: 'https://duetnightabyss.gachabuild.com/setup',
    images: [
      {
        url: 'https://duetnightabyss.gachabuild.com/duetnightabyss.png',
        width: 1200,
        height: 630,
        alt: 'GachaBuild Setup Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GachaBuild Setup Guide',
    description: 'Complete setup guide for GachaBuild Duet Night Abyss project.',
    images: ['https://duetnightabyss.gachabuild.com/duetnightabyss.png'],
  },
  alternates: {
    canonical: 'https://duetnightabyss.gachabuild.com/setup',
  },
};

export default function SetupPage() {
  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🚀 GachaBuild Setup | Cài đặt GachaBuild
            </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Current Status
              </h2>
              <p className="text-blue-800">
                ✅ App is configured to use Sanity-only data<br/>
                ✅ All static data has been removed<br/>
                ✅ Sanity connection is working<br/>
                ❌ No data in Sanity yet (needs API token to import)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                Next Steps
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-yellow-800">
                <li>Get your Sanity API token from <a href="https://www.sanity.io/manage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sanity Manage</a></li>
                <li>Select your project (ID: <code className="bg-gray-200 px-1 rounded">u9m27k7u</code>)</li>
                <li>Go to &quot;API&quot; section and click &quot;Add API token&quot;</li>
                <li>Name: &quot;GachaBuild Import&quot;, Role: &quot;Editor&quot;</li>
                <li>Copy the token and run: <code className="bg-gray-200 px-1 rounded">echo &apos;SANITY_API_TOKEN=your_token_here&apos; &gt;&gt; .env.local</code></li>
                <li>Run the import commands in your terminal</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                Import Commands
              </h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>npm run import:characters</div>
                <div>npm run import:weapons</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Quick Setup Script
              </h2>
              <p className="text-gray-700 mb-3">
                You can also run the automated setup script:
              </p>
              <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm">
                <div>./setup-and-import.sh</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link 
                href="/characters" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Characters
              </Link>
              <Link 
                href="/weapons" 
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Weapons
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
