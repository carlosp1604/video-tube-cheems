import styles from '~/styles/pages/CommonPage.module.scss'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import {
  ProducersPaginationSortingType
} from '~/modules/Producers/Infrastructure/Frontend/ProducersPaginationSortingType'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { Producers } from '~/modules/Producers/Infrastructure/Components/Producers/Producers'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { ProfileCardDto } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDto'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import {
  AdCashResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashResponsiveBanner'
import {
  TrafficstarsResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Trafficstars/TrafficstarsResponsiveBanner'

export interface ProducersPageProps {
  initialSearchTerm: string
  initialPage: number
  initialOrder: ProducersPaginationSortingType
  initialProducers: ProfileCardDto[]
  initialProducersNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ProducersPage: NextPage<ProducersPageProps> = ({
  initialSearchTerm,
  initialProducers,
  initialProducersNumber,
  initialPage,
  initialOrder,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t, lang } = useTranslation('producers')

  let canonicalUrl = `${baseUrl}/producers`

  if (lang !== 'en') {
    canonicalUrl = `${baseUrl}/${lang}/producers`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('producers_page_title'),
      t('producers_page_description'),
      HtmlPageMetaContextResourceType.ARTICLE,
      canonicalUrl
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
  }

  return (
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <AdCashResponsiveBanner />

      <Producers
        initialSearchTerm={ initialSearchTerm }
        initialPage={ initialPage }
        initialProducers={ initialProducers }
        initialOrder={ initialOrder }
        initialProducersNumber={ initialProducersNumber }
      />

      <TrafficstarsResponsiveBanner />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          description={ t('producers_page_banner_description') }
          headerTag={ 'h2' }
        />
      </div>
    </div>
  )
}
