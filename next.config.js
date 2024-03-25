/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

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
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
