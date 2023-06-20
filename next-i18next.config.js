const path = require('path')

const nextI18nextConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  localePath: path.resolve('./public/locales'),
}

module.exports = nextI18nextConfig
