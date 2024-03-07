import styles from './VideoEmbedPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import { FC } from 'react'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'

export interface VideoEmbedPageProps {
  post: PostComponentDto
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const VideoEmbedPage: FC<VideoEmbedPageProps> = ({
  post,
  htmlPageMetaContextProps,
}) => {
  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      post.title,
      post.description,
      HtmlPageMetaContextResourceType.WEBSITE,
      post.thumb
    )
  ).getProperties()
  const htmlPageMetaProps = { ...htmlPageMetaContextProps, resourceProps: htmlPageMetaUrlProps }

  return (
    <div className={ styles.videoEmbedPage__container }>

      <HtmlPageMeta { ...htmlPageMetaProps } />

      <VideoPostPlayer
        embedPostMedia={ post.postMediaEmbedType.length > 0 ? post.postMediaEmbedType[0] : null }
        videoPostMedia={ post.postMediaVideoType.length > 0 ? post.postMediaVideoType[0] : null }
      />
    </div>
  )
}
