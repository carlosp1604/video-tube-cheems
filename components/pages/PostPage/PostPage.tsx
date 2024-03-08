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
import { Duration } from 'luxon'
import { ReactElement } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'

export interface PostPageProps {
  post: PostComponentDto
  postEmbedUrl: string
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
  relatedPosts,
  postCommentsNumber,
  postViewsNumber,
  postLikes,
  postDislikes,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('post_page')

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description: post.description,
    thumbnailUrl: [post.thumb],
    uploadDate: post.publishedAt,
    duration: Duration.fromMillis(Number.parseInt(post.duration) * 1000),
    // Get domainUrl from .env file
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

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaVideoService(
      post.title,
      post.description,
      post.thumb,
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
