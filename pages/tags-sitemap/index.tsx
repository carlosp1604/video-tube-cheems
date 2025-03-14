import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetAllTags } from '~/modules/PostTag/Application/GetAllTags/GetAllTags'
import { i18nConfig } from '~/i18n.config'

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

  const fields = tags.map((tag) => ({
    loc: `${baseUrl}/tags/${tag.slug}`,
    alternateRefs: i18nConfig.locales.map((locale) => ({
      href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/tags/${tag.slug}`,
      hreflang: locale,
    })),
  }))

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function TagsSitemapPage () {}
