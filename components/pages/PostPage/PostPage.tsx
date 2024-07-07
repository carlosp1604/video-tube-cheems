import { NextPage } from 'next'
import styles from './PostPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { Post } from '~/modules/Posts/Infrastructure/Components/Post/Post'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  HtmlPageMetaVideoService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaVideoService'
import { ReactElement, useEffect, useRef } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { SEOHelper } from '~/modules/Shared/Infrastructure/FrontEnd/SEOHelper'

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
  const firstClickRef = useRef(0)

  const description = SEOHelper.buildDescription(
    post.title,
    t,
    post.producer ? post.producer.name : '',
    post.actor ? post.actor.name : '',
    post.resolution
  )

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

  useEffect(() => {
    const clickHandler = () => {
      if (firstClickRef.current < 3) {
        firstClickRef.current = firstClickRef.current + 1
      }

      if (firstClickRef.current === 2 && process.env.NEXT_PUBLIC_VIDEO_PLAYER_POPUNDER_URL) {
        const script = document.createElement('script')

        script.async = true
        script.type = 'text/javascript'
        script.src = process.env.NEXT_PUBLIC_VIDEO_PLAYER_POPUNDER_URL

        document.body.appendChild(script)
      }
    }

    document.addEventListener('click', clickHandler)

    return () => document.addEventListener('click', clickHandler)
  }, [])

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description,
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
