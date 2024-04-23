import { GetServerSideProps } from 'next'
import { NotFound } from '~/components/pages/NotFound/NotFound'
import { Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  return {
    props: {},
  }
}

export default NotFound
