import { FC, useRef } from 'react'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import styles from './VideoPlayer.module.scss'

interface HTMLVideoPlayerProps {
  title: string
  videoPostMedia: PostMediaComponentDto
  onPlayerReady: () => void
  selectedMediaUrl: MediaUrlComponentDto
}

export const HtmlVideoPlayer: FC<HTMLVideoPlayerProps> = ({
  videoPostMedia,
  onPlayerReady,
  title,
}) => {
  const playerRef = useRef(null)

  return (
    <div className={ styles.videoPlayer__container }>
      <video
        ref={ playerRef }
        className={ styles.videoPlayer__player }
        title={ title }
        onLoad={ onPlayerReady }
        controls={ true }
        loop={ true }
      >
        {
          videoPostMedia.urls.map((mediaUrl) => {
            return (
              <source
                src={ mediaUrl.url }
                type="video/mp4"
                title={ mediaUrl.title }
                key={ mediaUrl.url }
              />
            )
          })
        }
      </video>
    </div>
  )
}
