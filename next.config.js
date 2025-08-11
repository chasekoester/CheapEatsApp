/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditional output based on environment
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true'
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true }
      }
    : {}),
  
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Production optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Bundle analyzer for production builds
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        )
      }
    }
    return config
  },

}

module.exports = nextConfig
