import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
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
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'
import { useRouter } from 'next/router'

export interface ProducersPageProps {
  initialPage: number
  initialOrder: ProducersPaginationSortingType
  initialProducers: ProducerCardDto[]
  initialProducersNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ProducersPage: NextPage<ProducersPageProps> = ({
  initialProducers,
  initialProducersNumber,
  initialPage,
  initialOrder,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t } = useTranslation('producers')
  const locale = useRouter().locale ?? 'en'

  let canonicalUrl = `${baseUrl}/producers`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/producers`
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
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <MobileBanner />

      <Producers
        initialPage={ initialPage }
        initialProducers={ initialProducers }
        initialOrder={ initialOrder }
        initialProducersNumber={ initialProducersNumber }
      />
    </>
  )
}
