import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { Home } from '~/components/Home/Home'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'

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

export const HomePage: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation(['home_page'])

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: t('home_page_title'),
    url: props.htmlPageMetaContextProps.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${props.baseUrl}/posts/search?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('home_page_title'),
      t('home_page_description'),
      HtmlPageMetaContextResourceType.WEBSITE
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

      <MobileBanner />

      <Home
        page={ props.page }
        activeProducer={ props.activeProducer }
        producers={ props.producers }
        initialPosts={ props.initialPosts }
        initialPostsNumber={ props.initialPostsNumber }
        order={ props.order }
      />
    </>
  )
}
