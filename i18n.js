// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { i18nConfig } = require('./i18n.config.js')

const config = {
  defaultLocale: i18nConfig.defaultLocale,
  locales: i18nConfig.locales,
  loadLocaleFrom: (lang, ns) => {
    return new Promise((resolve, reject) => {
      import(`./public/locales/${lang}/${ns}.json`)
        .then((module) => resolve(module.default))
        .catch((exception) => reject((exception)))
    })
  },
  localeDetection: true,
  logBuild: false,
  pages: {
    '*': [
      'app_menu',
      'footer',
      'menu',
      'user_menu',
      'user_login',
      'user_signup',
      'user_retrieve_password',
      'error',
      'common',
      'advertising',
      'carousel',
      'post_card_options',
      'post_card_gallery',
    ],
    'rgx:/users/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'api_exceptions',
      'user_profile',
    ],
    '/': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'api_exceptions',
      'home_page',
    ],
    'rgx:/producers/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'producers',
      'api_exceptions',
    ],
    'rgx:/tags/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'tags',
      'api_exceptions',
    ],
    'rgx:/actors/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'actors',
      'api_exceptions',
    ],
    'rgx:/posts/videos/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'api_exceptions',
      'post_card_options',
      'post_card_gallery',
      'post_page',
      'post',
      'post_comments',
    ],
    'rgx:/posts/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'search',
      'api_exceptions',
    ],
    '/posts': [
      'posts_page',
    ],
    'rgx:/posts/top/*': [
      'top',
      'post_card',
    ],
  },

}

module.exports = config
