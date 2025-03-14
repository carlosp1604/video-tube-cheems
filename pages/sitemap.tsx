import { GetServerSideProps } from 'next'
import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the sitemap page')
  } else {
    baseUrl = env.BASE_URL
  }

  const fields: Array<ISitemapField> = [
    {
      loc: `${baseUrl}/`,
      alternateRefs: i18nConfig.locales.map((locale) => ({
        href: `${baseUrl}/${locale === i18nConfig.defaultLocale ? '' : locale}`,
        hreflang: locale,
      })),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/producers`,
      alternateRefs: i18nConfig.locales.map((locale) => ({
        href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/producers`,
        hreflang: locale,
      })),
      changefreq: 'weekly',
    },
    {
      loc: `${baseUrl}/tags`,
      alternateRefs: i18nConfig.locales.map((locale) => ({
        href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/tags`,
        hreflang: locale,
      })),
      changefreq: 'never',
    },
    {
      loc: `${baseUrl}/actors`,
      alternateRefs: i18nConfig.locales.map((locale) => ({
        href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/actors`,
        hreflang: locale,
      })),
      changefreq: 'weekly',
    },
    {
      loc: `${baseUrl}/posts`,
      alternateRefs: i18nConfig.locales.map((locale) => ({
        href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/posts`,
        hreflang: locale,
      })),
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/posts/top`,
      alternateRefs: i18nConfig.locales.map((locale) => ({
        href: `${baseUrl}${locale === i18nConfig.defaultLocale ? '' : `/${locale}`}/posts/top`,
        hreflang: locale,
      })),
      changefreq: 'hourly',
      priority: 0.8,
    },
  ]

  context.res.setHeader(
    'Cache-Control',
    'no-store'
  )

  return getServerSideSitemapLegacy(context, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapPage () {}
