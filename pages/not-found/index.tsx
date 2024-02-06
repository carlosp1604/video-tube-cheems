import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NotFound } from '~/components/pages/NotFound/NotFound'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'home_page',
    'app_menu',
    'app_banner',
    'footer',
    'menu',
    'user_menu',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'error',
  ])

  return {
    props: {
      ...i18nSSRConfig,
    },
  }
}

export default NotFound
