/**
 * Next.js configuration for NutriWell.ai
 * 
 * Features:
 * - Internationalization (i18n) support
 * - Performance optimizations
 * - Static export configuration
 * - Security headers
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Internationalization configuration
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en',
  },

  // Static export configuration (uncomment for GitHub Pages deployment)
  // output: 'export',
  // trailingSlash: true,
  // basePath: '/nutrivell.ai',
  // assetPrefix: '/nutrivell.ai/',

  // Performance optimizations
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;