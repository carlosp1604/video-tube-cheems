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

export interface Props {
  posts: Array<PostCardComponentDto>
  option: string
  currentDate: string
  baseUrl: string
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const TopVideoPostsPage: NextPage<Props> = ({
  posts,
  option,
  currentDate,
  baseUrl,
  htmlPageMetaContextProps,
}) => {
  const { t, lang } = useTranslation('top')

  let canonicalUrl = `${baseUrl}/posts/top`

  if (lang !== 'en') {
    canonicalUrl = `${baseUrl}/${lang}/posts/top`
  }

  if (option !== 'day') {
    canonicalUrl = `${canonicalUrl}/${option}`
  }

  let pageTitle = t('top_posts_page_title', { option: t('top_posts_option_day_title') })

  if (option === 'week') {
    pageTitle = t('top_posts_page_title', { option: t('top_posts_option_week_title') })
  }

  if (option === 'month') {
    pageTitle = t('top_posts_page_title', { option: t('top_posts_option_month_title') })
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      pageTitle,
      t('top_posts_page_description'),
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

      <TopVideoPosts
        posts={ posts }
        currentDate={ currentDate }
        currentOption={ option }
      />

      <AdsterraResponsiveBanner/>
    </div>
  )
}
