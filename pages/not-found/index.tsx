import { GetServerSideProps } from 'next'
import { NotFound } from '~/components/pages/NotFound/NotFound'
import { Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps = async (context) => {
  Settings.defaultLocale = context.locale ?? 'en'

  Settings.defaultZone = 'Europe/Madrid'

  return {
    props: {},
  }
}

export default NotFound
