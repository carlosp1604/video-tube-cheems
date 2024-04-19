import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NotFound } from '~/components/pages/NotFound/NotFound'
import { Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'home_page',
    'app_menu',
    'app_banner',
    'footer',
    'menu',
    'user_menu',
    'user_signu p',
    'user_login',
    'user_retrieve_password',
    'error',
    'common',
  ])

  return {
    props: {
      ...i18nSSRConfig,
    },
  }
}

export default NotFound
