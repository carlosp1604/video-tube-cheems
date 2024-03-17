import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { urlsPerPage } from '~/modules/Shared/Infrastructure/SitemapPagination'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'

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
    sortCriteria: InfrastructureSortingCriteria.DESC,
    sortOption: InfrastructureSortingOptions.NAME,
  })

  if (actors.actors.length === 0) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  const fields = actors.actors.map((actor) => ({
    loc: `${baseUrl}/actors/${actor.actor.slug}`,
    // TODO: Change this for updatedAt field
    lastmod: actor.actor.createdAt,
    alternateRefs: [{
      href: `${baseUrl}/${locale}/actors/${actor.actor.slug}`,
      hreflang: 'es',
    }],
  }))

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ActorsSitemapPage () {}
