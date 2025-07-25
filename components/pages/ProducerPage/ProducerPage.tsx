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
import { MdLiveTv } from 'react-icons/md'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import {
  TrafficstarsResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Trafficstars/TrafficstarsResponsiveBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'

export interface ProducerPageProps {
  page: number
  order: PostsPaginationSortingType
  producer: ProducerPageComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
  asPath: string
}

export const ProducerPage: NextPage<ProducerPageProps> = ({
  page,
  order,
  producer,
  posts,
  postsNumber,
  htmlPageMetaContextProps,
  baseUrl,
  asPath,
}) => {
  const { t, lang } = useTranslation('producers')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: t('producers_breadcrumb_list_title'),
      item: `${baseUrl}/${lang}/producers`,
    }, {
      '@type': 'ListItem',
      position: 2,
      name: producer.name,
      item: `${baseUrl}/${lang}/producers/${producer.slug}`,
    }],
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('producer_page_title', { producerName: producer.name }),
      t('producer_page_description', { producerName: producer.name }),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl,
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

      <AdsterraResponsiveBanner />

      <ProfileHeader
        name={ producer.name }
        imageAlt={ t('producer_image_alt_title', { producerName: producer.name }) }
        imageUrl={ producer.imageUrl }
        profileType={ t('producer_page_profile_type_title') }
        icon={ <MdLiveTv/> }
        subtitle={ t('producer_page_profile_count_title',
          { viewsNumber: NumberFormatter.compatFormat(producer.viewsNumber, lang) }) }
        color={ producer.brandHexColor ? producer.brandHexColor : undefined }
      />

      <Producer
        key={ asPath }
        page={ page }
        order={ order }
        producer={ producer }
        posts={ posts }
        postsNumber={ postsNumber }
      />

      <TrafficstarsResponsiveBanner />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          headerTag={ 'h2' }
          description={ t('producer_page_banner_description', { producerName: producer.name }) }
        />
      </div>
    </div>
  )
}
