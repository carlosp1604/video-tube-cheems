import Head from 'next/head'
import { HtmlPageMetaProps } from './HtmlPageMetaProps'
import { FC, ReactElement } from 'react'
import {
  HtmlPageMetaContextResourceType
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaVideoProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceProps'
import { UrlsHelper } from '~/helpers/Domain/UrlsHelper'
import useTranslation from 'next-translate/useTranslation'

export const HtmlPageMeta: FC<HtmlPageMetaProps> = (props) => {
  const { t } = useTranslation('common')

  let videoMeta: ReactElement[] | null = null
  let rtaLabel: ReactElement| null = null
  let canonicalTag: ReactElement | null = null
  const robotsTagContent =
    `${props.robots.follow ? 'follow' : 'nofollow'}, ${props.robots.index ? 'index' : 'noindex'}`

  let title = props.resourceProps.title

  if (!title.startsWith(props.resourceProps.siteName)) {
    title = t('page_title_with_language', { sitename: props.resourceProps.siteName, title: props.resourceProps.title })
  }

  if (props.resourceProps.resourceType === HtmlPageMetaContextResourceType.VIDEO_MOVIE) {
    const videoProps = props.resourceProps as HtmlPageMetaVideoProps

    videoMeta = [
      <meta property="og:video:url" content={ UrlsHelper.deleteTrailingSlash(videoProps.videoUrl) } key="og:video" />,
      <meta property="og:video:type" content='text/html' key="og:video:type" />,
      <meta property="og:video:duration" content={ videoProps.duration } key="og:video:duration" />,
      <meta property="video:duration" content={ videoProps.duration } key="video:duration" />,
      /** Twitter card properties **/
      <meta name="twitter:card" content="player" key="twitter:card" />,
      <meta name="twitter:title" content={ title } key="twitter:title" />,
      <meta name="twitter:description" content={ videoProps.description } key="twitter:description" />,
      <meta name="twitter:url" content={ UrlsHelper.deleteTrailingSlash(props.url) } key="twitter:url" />,
      <meta name="twitter:image" content={ props.resourceProps.image } key="twitter:image" />,
      <meta
        name="twitter:player"
        content={ UrlsHelper.deleteTrailingSlash(videoProps.videoUrl) }
        key="twitter:player"
      />,
      <meta name="twitter:player:width" content={ videoProps.width } key="twitter:player:width" />,
      <meta name="twitter:player:height" content={ videoProps.height } key="twitter:player:height" />,
    ]
  }

  let websiteMeta: ReactElement[] | null = null

  if (
    props.resourceProps.resourceType === HtmlPageMetaContextResourceType.WEBSITE ||
    props.resourceProps.resourceType === HtmlPageMetaContextResourceType.ARTICLE
  ) {
    websiteMeta = [
      /** Twitter card properties **/
      <meta name="twitter:card" content="summary" key="twitter:card" />,
      <meta name="twitter:title" content={ title } key="twitter:title" />,
      <meta name="twitter:description" content={ props.resourceProps.description } key="twitter:description" />,
      <meta name="twitter:image" content={ props.resourceProps.image } key="twitter:image" />,
    ]
  }

  let structuredDataScript: ReactElement | null = null

  if (props.structuredData) {
    structuredDataScript = (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: props.structuredData } }
      />
    )
  }

  if (process.env.NEXT_PUBLIC_RTA_LABEL) {
    rtaLabel = (
      <meta name="RATING" content={ process.env.NEXT_PUBLIC_RTA_LABEL } key="RATING"/>
    )
  }

  if (props.resourceProps.canonical) {
    canonicalTag = (
      <link
        rel="canonical"
        href={ UrlsHelper.deleteTrailingSlash(props.resourceProps.canonical) }
        key="canonical"
      />
    )
  }

  const alternateUrls: ReactElement[] = []

  props.alternateLocale.forEach((alternateUrl) => (
    alternateUrls.push(
      <link
        rel="alternate"
        hrefLang={ alternateUrl.locale }
        href={ UrlsHelper.deleteTrailingSlash(alternateUrl.alternateUrl) }
        key={ UrlsHelper.deleteTrailingSlash(alternateUrl.alternateUrl) }
      />
    )
  ))

  return (
    <Head>
      { rtaLabel }
      { canonicalTag }
      <meta name="robots" content={ robotsTagContent }/>
      <title>{ title }</title>
      <meta name="description" content={ props.resourceProps.description } key="description"/>
      <meta property="og:title" content={ title } key="og:title"/>
      <meta property="og:description" content={ props.resourceProps.description } key="og:description"/>
      <meta property="og:site_name" content={ props.resourceProps.siteName } key="og:site_name"/>
      <meta property="og:type" content={ props.resourceProps.resourceType } key="og:type"/>
      <meta property="og:url" content={ UrlsHelper.deleteTrailingSlash(props.url) } key="og:url"/>
      <meta property="og:image" content={ props.resourceProps.image } key="og:image"/>
      <meta property="og:locale" content={ props.locale } key="og:locale"/>
      { websiteMeta }
      { videoMeta }
      {
        props.alternateLocale.map((alternate) => (
          <meta
            property="og:locale:alternate"
            content={ alternate.locale }
            key={ alternate.locale }
          />
        ))
      }
      { alternateUrls }
      { structuredDataScript }
    </Head>
  )
}
