import { NextPage } from 'next'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/Banner/MobileBanner'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { TopVideoPosts } from '~/modules/Posts/Infrastructure/Components/TopVideoPosts/TopVideoPosts'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import {
  HtmlPageMetaContextResourceType, HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'

export interface Props {
  todayTopPosts: PostCardComponentDto[]
  weekTopPosts: PostCardComponentDto[]
  monthTopPosts: PostCardComponentDto[]
  currentDay: string
  currentMonth: string
  currentWeek: string
  baseUrl: string
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const TopVideoPostsPage: NextPage<Props> = ({
  todayTopPosts,
  weekTopPosts,
  monthTopPosts,
  currentDay,
  currentMonth,
  currentWeek,
  baseUrl,
  htmlPageMetaContextProps,
}) => {
  const locale = useRouter().locale ?? 'en'
  const { t } = useTranslation('top')

  let canonicalUrl = `${baseUrl}/posts/top`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/posts/top`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('top_posts_page_title'),
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
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <MobileBanner />

      <TopVideoPosts
        monthTopPosts={ monthTopPosts }
        todayTopPosts={ todayTopPosts }
        weekTopPosts={ weekTopPosts }
        currentDay={ currentDay }
        currentMonth={ currentMonth }
        currentWeek={ currentWeek }
      />
    </>
  )
}
