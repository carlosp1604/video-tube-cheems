import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { Home } from '~/components/Home/Home'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { useRouter } from 'next/router'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'

export interface Props {
  posts: Array<PostCardComponentDto>
  trendingPosts: Array<PostCardComponentDto>
  tags: Array<TagCardComponentDto>
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const HomePage: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation('home_page')
  const locale = useRouter().locale ?? 'en'

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: t('home_page_title'),
    url: props.htmlPageMetaContextProps.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${props.baseUrl}/${locale}/posts/search?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  let canonicalUrl = props.baseUrl

  if (locale !== 'en') {
    canonicalUrl = `${props.baseUrl}/${locale}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('home_page_title'),
      t('home_page_description'),
      HtmlPageMetaContextResourceType.WEBSITE,
      canonicalUrl // canonical -> Home page
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...props.htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Home
        posts={ props.posts }
        trendingPosts={ props.trendingPosts }
        tags={ props.tags }
      />

      <AppBanner />
    </>
  )
}
