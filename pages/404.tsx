import { GetStaticPropsContext } from 'next'

export default function Custom404 () {
  return null
}

export const getStaticProps = (context: GetStaticPropsContext) => {
  const locale = context.locale ?? 'en'

  return {
    redirect: {
      destination: `/${locale}/not-found`,
    },
  }
}
