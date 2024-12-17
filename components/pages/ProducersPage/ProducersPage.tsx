import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
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
import { useRouter } from 'next/router'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'

export interface ProducersPageProps {
  initialSearchTerm: string
  initialPage: number
  initialOrder: ProducersPaginationSortingType
  initialProducers: ProducerCardDto[]
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

      <CrackrevenuePostPageBanner />

      <Producers
        initialSearchTerm={ initialSearchTerm }
        initialPage={ initialPage }
        initialProducers={ initialProducers }
        initialOrder={ initialOrder }
        initialProducersNumber={ initialProducersNumber }
      />
    </>
  )
}
