const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
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
      'app_banner',
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
    'rgx:/posts/search/*': [
      'sorting_menu_dropdown',
      'post_card',
      'pagination_bar',
      'search',
      'api_exceptions',
    ],
    '/posts/top': [
      'top',
      'post_card',
    ],
  },

}

module.exports = i18nConfig
