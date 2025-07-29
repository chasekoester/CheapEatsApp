/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for static generation where possible
  output: 'standalone',

  // Enable experimental features for better Netlify compatibility
  experimental: {
    appDir: true,
  },

  // Image optimization settings for Netlify
  images: {
    unoptimized: true, // Required for static exports
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'source.unsplash.com'
    ],
  },

  // Disable telemetry for cleaner builds
  telemetry: {
    disabled: true,
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce bundle size for client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // API routes configuration for serverless functions
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },

  // Headers for security
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
