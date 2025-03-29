import styles from '~/styles/pages/CommonPage.module.scss'
import { NextPage } from 'next'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { Actors } from '~/modules/Actors/Infrastructure/Components/Actors/Actors'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import { ProfileCardDto } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDto'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'

export interface ActorsPageProps {
  initialSearchTerm: string
  initialPage: number
  initialOrder: ActorsPaginationSortingType
  initialActors: ProfileCardDto[]
  initialActorsNumber: number
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const ActorsPage: NextPage<ActorsPageProps> = ({
  initialSearchTerm,
  initialActors,
  initialActorsNumber,
  initialPage,
  initialOrder,
  htmlPageMetaContextProps,
  baseUrl,
}) => {
  const { t, lang } = useTranslation('actors')

  let canonicalUrl = `${baseUrl}/actors`

  if (lang !== 'en') {
    canonicalUrl = `${baseUrl}/${lang}/actors`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('actors_page_title'),
      t('actors_page_description'),
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

      <CrackrevenuePostPageBanner/>

      <Actors
        initialSearchTerm={ initialSearchTerm }
        initialPage={ initialPage }
        initialOrder={ initialOrder }
        initialActors={ initialActors }
        initialActorsNumber={ initialActorsNumber }
      />

      <AdsterraResponsiveBanner/>

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          headerTag={ 'h2' }
          description={ t('actors_page_banner_description') }
        />
      </div>
    </div>
  )
}
