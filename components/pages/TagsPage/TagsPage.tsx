import styles from '~/styles/pages/CommonPage.module.scss'
import { NextPage } from 'next'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'
import { Tags } from '~/modules/PostTag/Infrastructure/Components/Tags/Tags'
import { useRouter } from 'next/router'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import useTranslation from 'next-translate/useTranslation'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import {
  AdCashResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashResponsiveBanner'
import {
  TrafficstarsResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Trafficstars/TrafficstarsResponsiveBanner'

export interface Props {
  tagCards: TagCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const TagsPage: NextPage<Props> = ({ tagCards, htmlPageMetaContextProps, baseUrl }) => {
  const locale = useRouter().locale ?? 'en'
  const { t } = useTranslation('tags')

  let canonicalUrl = `${baseUrl}/tags`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/tags`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('tags_page_title'),
      t('tags_page_description'),
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

      <Tags key={ locale } tagCards={ tagCards }/>

      <TrafficstarsResponsiveBanner />

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          headerTag={ 'h2' }
          description={ t('tags_page_banner_description') }
        />
      </div>
    </div>
  )
}
