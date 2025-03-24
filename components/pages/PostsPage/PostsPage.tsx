import styles from '~/styles/pages/CommonPage.module.scss'
import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import { Posts } from '~/components/Posts/Posts'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
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

  let canonicalUrl = props.baseUrl + '/posts'

  if (lang !== 'en') {
    canonicalUrl = `${props.baseUrl}/${lang}/posts`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('posts_page_title'),
      t('posts_page_description'),
      HtmlPageMetaContextResourceType.WEBSITE,
      canonicalUrl
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

      <CrackrevenuePostPageBanner />

      <Posts
        page={ props.page }
        activeProducer={ props.activeProducer }
        producers={ props.producers }
        initialPosts={ props.initialPosts }
        initialPostsNumber={ props.initialPostsNumber }
        order={ props.order }
      />
    </div>
  )
}
