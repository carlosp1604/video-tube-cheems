import styles from '~/styles/pages/CommonPage.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { Home } from '~/components/Home/Home'
import { NextPage } from 'next'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'

export interface Props {
  posts: Array<PostCardComponentDto>
  trendingPosts: Array<PostCardComponentDto>
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const HomePage: NextPage<Props> = (props: Props) => {
  const { t, lang } = useTranslation('home_page')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: t('home_page_title'),
    url: props.htmlPageMetaContextProps.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${props.baseUrl}/${lang}/posts/search?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  let canonicalUrl = props.baseUrl

  if (lang !== 'en') {
    canonicalUrl = `${props.baseUrl}/${lang}`
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
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Home
        posts={ props.posts }
        trendingPosts={ props.trendingPosts }
      />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          description={ t('home_page_banner_description') }
          headerTag={ 'h1' }
        />
      </div>
    </div>
  )
}
