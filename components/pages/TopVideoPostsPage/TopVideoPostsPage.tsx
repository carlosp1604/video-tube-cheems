import { NextPage } from 'next'
import styles from '~/styles/pages/CommonPage.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { TopVideoPosts } from '~/modules/Posts/Infrastructure/Components/TopVideoPosts/TopVideoPosts'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType, HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  CrackrevenuePostPageBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/Crackrevenue/CrackrevenuePostPageBanner'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'

export interface Props {
  posts: Array<PostCardComponentDto>
  option: string
  currentDate: string
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const TopVideoPostsPage: NextPage<Props> = ({
  posts,
  option,
  currentDate,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('top')

  let optionTitle = t('top_posts_option_day_title')

  if (option === 'week') {
    optionTitle = t('top_posts_option_week_title')
  }

  if (option === 'month') {
    optionTitle = t('top_posts_option_month_title')
  }
  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('top_posts_page_title', { option: optionTitle }),
      t('top_posts_page_description', { option: optionTitle }),
      HtmlPageMetaContextResourceType.ARTICLE,
      htmlPageMetaContextProps.canonicalUrl
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

      <TopVideoPosts
        posts={ posts }
        currentDate={ currentDate }
        currentOption={ option }
      />

      <AdsterraResponsiveBanner/>

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          description={ t('top_posts_page_banner_description', { option: optionTitle }) }
          headerTag={ 'h2' }
        />
      </div>
    </div>
  )
}
