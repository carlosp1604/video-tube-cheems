import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { urlsPerPage } from '~/modules/Shared/Infrastructure/SitemapPagination'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params?.page || isNaN(Number(context.params?.page))) {
    return {
      notFound: true,
    }
  }

  const page = Number(context.params?.page)

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the posts sitemap page')
  } else {
    baseUrl = env.BASE_URL
  }

  const posts = await getPosts.get({
    page,
    postsPerPage: urlsPerPage,
    filters: [],
    sortCriteria: InfrastructureSortingCriteria.ASC,
    sortOption: InfrastructureSortingOptions.DATE,
  })

  if (posts.posts.length === 0) {
    return {
      notFound: true,
    }
  }

  const fields = posts.posts.map((post) => ({
    loc: `${baseUrl}/posts/videos/${post.post.slug}`,
    alternateRefs: i18nConfig.locales.map((locale) => ({
      href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/posts/videos/${post.post.slug}`,
      hreflang: locale,
    })),
  }))

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function PostsSitemapPage () {}
