import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { urlsPerPage } from '~/modules/Shared/Infrastructure/SitemapPagination'
import { GetProducers } from '~/modules/Producers/Application/GetProducers/GetProducers'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params?.page || isNaN(Number(context.params?.page))) {
    return {
      notFound: true,
    }
  }

  const page = Number(context.params?.page)

  const getProducers = container.resolve<GetProducers>('getProducersUseCase')

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the producers sitemap page')
  } else {
    baseUrl = env.BASE_URL
  }

  const producers = await getProducers.get({
    page,
    producersPerPage: urlsPerPage,
    sortCriteria: InfrastructureSortingCriteria.ASC,
    sortOption: InfrastructureSortingOptions.NAME,
    filters: [],
  })

  if (producers.producers.length === 0) {
    return {
      notFound: true,
    }
  }

  const fields = producers.producers.map((producer) => ({
    loc: `${baseUrl}/producers/${producer.producer.slug}`,
    alternateRefs: i18nConfig.locales.map((locale) => ({
      href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/producers/${producer.producer.slug}`,
      hreflang: locale,
    })),
  }))

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ProducersSitemapPage () {}
