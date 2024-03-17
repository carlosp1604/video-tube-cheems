import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { useTranslation } from 'next-i18next'
import { ProducerPageComponentDto } from '~/modules/Producers/Infrastructure/ProducerPageComponentDto'
import { Producer } from '~/modules/Producers/Infrastructure/Components/Producer/Producer'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileHeader } from '~/modules/Shared/Infrastructure/Components/ProfileHeader/ProfileHeader'
import styles from './ProducerPage.module.scss'
import { useRouter } from 'next/router'

export interface ProducerPageProps {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  producer: ProducerPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ProducerPage: NextPage<ProducerPageProps> = ({
  initialPage,
  initialOrder,
  producer,
  initialPosts,
  initialPostsNumber,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t } = useTranslation('producers')
  const locale = useRouter().locale ?? 'en'

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: t('producers_breadcrumb_list_title'),
      item: `${baseUrl}/${locale}/producers/`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: producer.name,
      item: `${baseUrl}/${locale}/producers/${producer.slug}/`,
    }],
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('producer_page_title', { producerName: producer.name }),
      t('producer_page_description', { producerName: producer.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      `${baseUrl}/${locale}/producers/${producer.slug}/`,
      producer.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <div className={ styles.producerPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <ProfileHeader
        name={ producer.name }
        imageAlt={ t('producer_image_alt_title', { producerName: producer.name }) }
        imageUrl={ producer.imageUrl }
        customColor={ producer.brandHexColor }
        rounded={ true }
      />

      <Producer
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        producer={ producer }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />
    </div>
  )
}
