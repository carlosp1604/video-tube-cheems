const path = require('path')

const nextI18nextConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  loadLocaleFrom: (lang, ns) => {
    import(`./myTranslationsFiles/${lang}/${ns}.json`).then((m) => m.default)
  }
}

module.exports = nextI18nextConfig
