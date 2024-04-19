import { NextPage } from 'next'
import styles from './PostPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'
import { Post } from '~/modules/Posts/Infrastructure/Components/Post/Post'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  HtmlPageMetaVideoService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaVideoService'
import { ReactElement } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'
import Script from 'next/script'
import { useRouter } from 'next/router'

export interface PostPageProps {
  post: PostComponentDto
  parsedDuration: string
  postEmbedUrl: string
  baseUrl: string
  postViewsNumber: number
  postLikes: number
  postDislikes: number
  postCommentsNumber: number
  relatedPosts: PostCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const PostPage: NextPage<PostPageProps> = ({
  post,
  postEmbedUrl,
  parsedDuration,
  baseUrl,
  relatedPosts,
  postCommentsNumber,
  postViewsNumber,
  postLikes,
  postDislikes,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('post_page')
  const locale = useRouter().locale ?? 'en'

  let popUnder: ReactElement | null = null

  if (process.env.NEXT_PUBLIC_POPUNDER_URL) {
    popUnder = (
      <Script
        type={ 'text/javascript' }
        src={ process.env.NEXT_PUBLIC_POPUNDER_URL }
        async={ true }
      />
    )
  }

  let videoPopUnder: ReactElement | null = null

  if (process.env.NEXT_PUBLIC_VIDEO_PLAYER_POPUNDER_URL) {
    videoPopUnder = (
      <Script
        type={ 'text/javascript' }
        src={ process.env.NEXT_PUBLIC_VIDEO_PLAYER_POPUNDER_URL }
        async={ true }
      />
    )
  }

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description: post.description,
    thumbnailUrl: [post.thumb],
    uploadDate: post.publishedAt,
    duration: parsedDuration,
    embedUrl: postEmbedUrl,
    interactionStatistics: [
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: postViewsNumber,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'LikeAction' },
        userInteractionCount: postLikes,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'DislikeAction' },
        userInteractionCount: postDislikes,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'CommentAction' },
        userInteractionCount: postCommentsNumber,
      },
    ],
  }

  let canonicalUrl = `${baseUrl}/posts/videos/${post.slug}`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/posts/videos/${post.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaVideoService(
      post.title,
      post.description,
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
      <div className={ styles.postPage__relatedVideos }>
        <span className={ styles.postPage__relatedVideosTitle }>
          { t('video_related_videos_title') }
        </span>
        <PostCardGallery
          posts={ relatedPosts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        />
      </div>
    )
  }

  return (
    <>
      { popUnder }

      { videoPopUnder }

      <HtmlPageMeta { ...htmlPageMetaProps } />

      <MobileBanner />

      <Post
        post={ post }
        key={ post.id }
        postCommentsNumber={ postCommentsNumber }
        postLikes={ postLikes }
        postDislikes={ postDislikes }
        postViewsNumber={ postViewsNumber }
      />

      { relatedPostsSection }
    </>
  )
}
