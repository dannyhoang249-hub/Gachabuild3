import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',
  // Only use static export for production builds, not for development
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),

  // Disable ESLint during build for Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.sanity.io https://*.sanity.studio",
              "frame-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  
  images: {
    unoptimized: process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true',
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
        querystring: false,
      };
    }
    
    // Ignore fs module in client-side bundles
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^fs$/,
        contextRegExp: /@nodelib/,
      })
    );
    
    return config;
  },
};

export default nextConfig;
