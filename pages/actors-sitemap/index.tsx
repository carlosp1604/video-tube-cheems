import { GetServerSideProps } from 'next'
import { getServerSideSitemapIndexLegacy } from 'next-sitemap'
import { container } from '~/awilix.container'
import { urlsPerPage } from '~/modules/Shared/Infrastructure/SitemapPagination'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const actorRepository = container.resolve('actorRepository')

  const count = await actorRepository.count()
  const amountOfSitemapFiles = Math.ceil(count / urlsPerPage)

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the actors sitemap index page')
  } else {
    baseUrl = env.BASE_URL
  }

  const sitemaps = Array.from(Array(amountOfSitemapFiles + 1).keys())
    .filter((index) => { return index !== 0 })
    .map((index) => `${baseUrl}/actors-sitemap-${index}.xml`)

  return getServerSideSitemapIndexLegacy(context, sitemaps)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ActorsSitemapIndexPage () {}
