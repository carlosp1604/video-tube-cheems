import { FC, ReactElement } from 'react'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { VideoPostPlayer } from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayer'
import styles from './VideoPostType.module.scss'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export interface Props {
  post: PostComponentDto
  mediaUrls: MediaUrlComponentDto[]
  postBasicDataElement: ReactElement
  postOptionsElement:ReactElement
}

export const VideoPostType: FC<Props> = ({
  post,
  mediaUrls,
  postBasicDataElement,
  postOptionsElement,
}) => {
  return (
    <>
      <div className={ styles.videoPostType__videoContainer } >
        <VideoPostPlayer
          mediaUrls={ mediaUrls }
          embedPostMedia={ post.postMediaEmbedType.length > 0 ? post.postMediaEmbedType[0] : null }
          videoPostMedia={ post.postMediaVideoType.length > 0 ? post.postMediaVideoType[0] : null }
        />
      </div>

      { postBasicDataElement }
      { postOptionsElement }
    </>
  )
}
