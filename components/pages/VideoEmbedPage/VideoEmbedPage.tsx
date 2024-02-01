import styles from './VideoEmbedPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { useTranslation } from 'next-i18next'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  HtmlPageMetaVideoService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaVideoService'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { FC, useMemo } from 'react'

export interface VideoEmbedPageProps {
  post: PostComponentDto
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const VideoEmbedPage: FC<VideoEmbedPageProps> = ({
  post,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('post_page')

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaVideoService(
      post.title,
      post.description,
      post.thumb,
      'some-video-url xd',
      post.duration
    )
  ).getProperties()
  const htmlPageMetaProps = { ...htmlPageMetaContextProps, resourceProps: htmlPageMetaUrlProps }

  const getMediaUrls = (type: string): MediaUrlComponentDto[] => {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (post.postMediaEmbedType.length > 0) {
      if (type === 'access') {
        mediaUrls = [...mediaUrls, ...post.postMediaEmbedType[0].urls]
      } else {
        mediaUrls = [...mediaUrls, ...post.postMediaEmbedType[0].downloadUrls]
      }
    }

    if (post.postMediaVideoType.length > 0) {
      if (type === 'access') {
        mediaUrls = [...mediaUrls, ...post.postMediaVideoType[0].urls]
      } else {
        mediaUrls = [...mediaUrls, ...post.postMediaVideoType[0].downloadUrls]
      }
    }

    return mediaUrls
  }

  const mediaUrls = useMemo(() => getMediaUrls('access'), [post])

  return (
    <div className={ styles.videoEmbedPage__container }>

      <HtmlPageMeta { ...htmlPageMetaProps } />

      <VideoPostPlayer
        mediaUrls={ mediaUrls }
        embedPostMedia={ post.postMediaEmbedType.length > 0 ? post.postMediaEmbedType[0] : null }
        videoPostMedia={ post.postMediaVideoType.length > 0 ? post.postMediaVideoType[0] : null }
      />
    </div>
  )
}
