import styles from '~/styles/pages/CommonPage.module.scss'
import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
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
import { useRouter } from 'next/router'
import { MdLiveTv } from 'react-icons/md'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

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
      item: `${baseUrl}/${locale}/producers`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: producer.name,
      item: `${baseUrl}/${locale}/producers/${producer.slug}`,
    }],
  }

  let canonicalUrl = `${baseUrl}/producers/${producer.slug}`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/producers/${producer.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('producer_page_title', { producerName: producer.name }),
      t('producer_page_description', { producerName: producer.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl,
      producer.imageUrl ?? undefined
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <CrackrevenuePostPageBanner />

      <ProfileHeader
        name={ producer.name }
        imageAlt={ t('producer_image_alt_title', { producerName: producer.name }) }
        imageUrl={ producer.imageUrl }
        profileType={ t('producer_page_profile_type_title') }
        icon={ <MdLiveTv /> }
        subtitle={ t('producer_page_profile_count_title',
          { viewsNumber: NumberFormatter.compatFormat(producer.viewsNumber, locale) }) }
        color={ producer.brandHexColor ? producer.brandHexColor : undefined }
      />

      <Producer
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        producer={ producer }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
      />

      <AdsterraResponsiveBanner />
    </div>
  )
}
