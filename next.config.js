/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations - removed export for auth support
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['jsdom', 'cheerio'],
  },

  // Image optimization for static export
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'logoeps.com',
      'logos-world.net',
      'upload.wikimedia.org'
    ],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack optimizations for production
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }

    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
          },
        },
      }
    }

    return config
  },

  // Compress assets
  compress: true,

  // Generate static site map
  generateBuildId: async () => {
    return 'cheapeats-build-' + Date.now()
  },
}

module.exports = nextConfig
