import styles from '~/styles/pages/CommonPage.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { Posts } from '~/components/Posts/Posts'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import {
  AdCashResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashResponsiveBanner'

export interface Props {
  asPath: string
  page: number
  order: PostsPaginationSortingType
  posts: PostCardComponentDto[]
  postsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const PostsPage: NextPage<Props> = (props: Props) => {
  const { t, lang } = useTranslation('posts_page')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: t('posts_page_title'),
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

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('posts_page_title'),
      t('posts_page_description'),
      HtmlPageMetaContextResourceType.WEBSITE,
      props.htmlPageMetaContextProps.canonicalUrl
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

      <AdCashResponsiveBanner />

      <Posts
        key={ props.asPath }
        page={ props.page }
        activeProducer={ props.activeProducer }
        producers={ props.producers }
        posts={ props.posts }
        postsNumber={ props.postsNumber }
        order={ props.order }
      />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          description={ t('posts_page_banner_description') }
          headerTag={ 'h2' }
        />
      </div>
    </div>
  )
}
