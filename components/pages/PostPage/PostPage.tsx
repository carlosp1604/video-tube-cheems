import styles from '~/styles/pages/CommonPage.module.scss'
import dynamic from 'next/dynamic'
import postPageStyles from './PostPage.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { Post } from '~/modules/Posts/Infrastructure/Components/Post/Post'
import { NextPage } from 'next'
import { SEOHelper } from '~/modules/Shared/Infrastructure/FrontEnd/SEOHelper'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  HtmlPageMetaVideoService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaVideoService'
import { ReactElement } from 'react'
import {
  PostCardCarouselSkeleton
} from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarouselSkeleton'
import {
  AdsterraResponsiveBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraResponsiveBanner'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'

const PostCardCarousel =
  dynamic(() => import('~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel')
    .then((module) => module.PostCardCarousel), {
    ssr: false,
    loading: () => {
      return (
        <PostCardCarouselSkeleton
          showData={ false }
          postCardsNumber={ 6 }
          loading={ true }
        />
      )
    },
  })

export interface PostPageProps {
  post: PostComponentDto
  parsedDuration: string
  postEmbedUrl: string
  baseUrl: string
  postViewsNumber: number
  relatedPosts: PostCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const PostPage: NextPage<PostPageProps> = ({
  post,
  postEmbedUrl,
  parsedDuration,
  baseUrl,
  relatedPosts,
  postViewsNumber,
  htmlPageMetaContextProps,
}) => {
  const { t, lang } = useTranslation('post_page')

  const title = SEOHelper.buildTitle(post.title)

  const description = SEOHelper.buildDescription(
    title,
    t,
    post.producer ? post.producer.name : null,
    post.actor ? post.actor.name : null
  )

  const bannerDescription = SEOHelper.buildBannerDescription(
    post.title,
    t,
    post.producer ? post.producer.name : null,
    post.actor ? post.actor.name : null
  )

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl: [post.thumb],
    uploadDate: post.publishedAt,
    duration: parsedDuration,
    embedUrl: postEmbedUrl,
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: postViewsNumber,
      },
    ],
  }

  let canonicalUrl = `${baseUrl}/posts/videos/${post.slug}`

  if (lang !== 'en') {
    canonicalUrl = `${baseUrl}/${lang}/posts/videos/${post.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaVideoService(
      title,
      description,
      post.thumb,
      canonicalUrl,
      postEmbedUrl,
      post.duration
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  let relatedPostsSection: ReactElement | null = null

  if (relatedPosts.length > 0) {
    relatedPostsSection = (
      <div className={ postPageStyles.postPage__relatedVideos }>
        <h2 className={ postPageStyles.postPage__relatedVideosTitle }>
          { t('video_related_videos_title') }
        </h2>
        <PostCardCarousel
          posts={ relatedPosts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          preloadImages={ false }
        />
      </div>
    )
  }

  return (
    <div className={ styles.commonPage__container }>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Post
        post={ post }
        key={ post.id }
        postViewsNumber={ postViewsNumber }
      />

      { relatedPostsSection }

      <AdsterraResponsiveBanner/>

      <div className={ styles.commonPage__pageBanner }>
        <AppBanner
          title={ t('common:app_banner_title') }
          headerTag={ 'h2' }
          description={ bannerDescription }
        />
      </div>
    </div>
  )
}
