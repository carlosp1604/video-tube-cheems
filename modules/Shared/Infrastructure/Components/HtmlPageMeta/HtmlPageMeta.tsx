import Head from 'next/head'
import { HtmlPageMetaProps } from './HtmlPageMetaProps'
import { FC } from 'react'

export const HtmlPageMeta: FC<HtmlPageMetaProps> = (props) => {
  return (
    <Head>
      <title>{ props.title }</title>
      <meta name="description" content={ props.description } key="description" />
      <meta property="og:title" content={ props.title } key="og:title" />
      <meta property="og:description" content={ props.description } key="og:description" />
      <meta property="og:site_name" content={ props.siteName } key="og:site_name" />
      <meta property="og:type" content={ props.resourceType } key="og:type" />
      <meta property="og:url" content={ props.url } key="og:url" />
      <meta property="og:image" content={ props.image } key="og:image" />
      <meta property="og:locale" content={ props.locale } key="og:locale" />
      {
        props.alternateLocale.map((locale) => (
          <meta
            property="og:locale:alternate"
            content={ locale }
            key={ locale }
          />
        ))
      }
    </Head>
  )
}
