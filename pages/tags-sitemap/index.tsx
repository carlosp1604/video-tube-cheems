import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetAllTags } from '~/modules/PostTag/Application/GetAllTags/GetAllTags'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const getTags = container.resolve<GetAllTags>('getAllTagsUseCase')

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the tags sitemap page')
  } else {
    baseUrl = env.BASE_URL
  }

  const tags = await getTags.get()

  if (tags.length === 0) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  const fields = tags.map((tag) => ({
    loc: `${baseUrl}/tags/${tag.slug}`,
    // TODO: Change this for updatedAt field
    lastmod: tag.createdAt,
    alternateRefs: [{
      href: `${baseUrl}/${locale}/tags/${tag.slug}`,
      hreflang: 'es',
    }],
  }))

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function TagsSitemapPage () {}
