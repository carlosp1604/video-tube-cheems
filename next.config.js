/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextTranslate = require('next-translate-plugin')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // transpilePackages: ['fluid-player'],
  rewrites: async () => [
    {
      source: '/posts-sitemap.xml',
      destination: '/posts-sitemap',
    },
    {
      source: '/posts-sitemap-:page.xml',
      destination: '/posts-sitemap/:page',
    },
    {
      source: '/actors-sitemap.xml',
      destination: '/actors-sitemap',
    },
    {
      source: '/actors-sitemap-:page.xml',
      destination: '/actors-sitemap/:page',
    },
    {
      source: '/producers-sitemap.xml',
      destination: '/producers-sitemap',
    },
    {
      source: '/producers-sitemap-:page.xml',
      destination: '/producers-sitemap/:page',
    },
  ],
  webpack: (config) => {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use))

    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (/css-loader[/\\](?:cjs|dist|src)/.test(moduleLoader.loader)) {
          if (typeof moduleLoader.options.modules === 'object') {
            moduleLoader.options.modules = {
              ...moduleLoader.options.modules,
              // https://github.com/webpack-contrib/css-loader#exportlocalsconvention
              exportLocalsConvention: 'dashesOnly',
            }
          }
        }
      })
    })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  async headers () {
    if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
      return []
    }

    return [
      {
        source: '/:all*(css|js|gif|svg|jpg|jpeg|png|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000', // 1 year by default
          },
        ],
      },
    ]
  },
}

module.exports = nextTranslate(nextConfig)
