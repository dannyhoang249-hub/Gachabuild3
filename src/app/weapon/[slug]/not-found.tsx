import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Weapon Not Found</h1>
        <p className="text-gray-600 mb-8">
          The weapon you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/weapons"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Weapons
        </Link>
      </div>
    </div>
  );
}
