import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',
  // Disable ESLint during build for Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static generation for dynamic routes during build
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
  images: {
    unoptimized: true,
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
