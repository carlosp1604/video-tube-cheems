import { FC } from 'react'
import styles from './VideoPlayer.module.scss'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JWPlayer from '@jwplayer/jwplayer-react'

interface VideoPlayerProps {
  videoPostMedia: PostMediaComponentDto
  onPlayerReady: () => void
  selectedMediaUrl: MediaUrlComponentDto
}

export const JWVideoPlayer: FC<VideoPlayerProps> = ({
  videoPostMedia,
  onPlayerReady,
}) => {
  // FIXME: advertising is not working
  let advertising = null

  if (process.env.NEXT_PUBLIC_VIDEO_PRE_ROLL_AD_URL) {
    advertising = {
      client: 'vast',
      schedule: [{
        offset: 'pre',
        tag: process.env.NEXT_PUBLIC_VIDEO_PRE_ROLL_AD_URL,
      }],
    }
  }

  // FIXME: Maybe we need to change this to support more video types
  const sources = videoPostMedia.urls.map((mediaUrl) => {
    return {
      file: mediaUrl.url,
      type: 'mp4',
      label: mediaUrl.title,
    }
  })

  const playlist = [{
    image: videoPostMedia.thumbnailUrl,
    sources,
  }]

  const onReady = () => {
    onPlayerReady()
  }

  return (
    <div className={ styles.videoPlayer__container }>
      <JWPlayer
        library={ 'https://cdn.jwplayer.com/libraries/cDnha7c4.js' }
        aspectRatio={ '16:9' }
        playlist={ playlist }
        onReady={ onReady }
        stretching={ 'fill' }
        horizontalVolumeSlider={ true }
        advertising={ advertising }
      />
    </div>
  )
}
