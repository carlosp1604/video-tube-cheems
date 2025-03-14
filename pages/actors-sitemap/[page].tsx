import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { urlsPerPage } from '~/modules/Shared/Infrastructure/SitemapPagination'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params?.page || isNaN(Number(context.params?.page))) {
    return {
      notFound: true,
    }
  }

  const page = Number(context.params?.page)

  const getActors = container.resolve<GetActors>('getActorsUseCase')

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the sitemap page')
  } else {
    baseUrl = env.BASE_URL
  }

  const actors = await getActors.get({
    page,
    actorsPerPage: urlsPerPage,
    sortCriteria: InfrastructureSortingCriteria.ASC,
    sortOption: InfrastructureSortingOptions.NAME,
    filters: [],
  })

  if (actors.actors.length === 0) {
    return {
      notFound: true,
    }
  }

  const fields = actors.actors.map((actor) => ({
    loc: `${baseUrl}/actors/${actor.actor.slug}`,
    alternateRefs: i18nConfig.locales.map((locale) => ({
      href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/actors/${actor.actor.slug}`,
      hreflang: locale,
    })),
  }))

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ActorsSitemapPage () {}
