import { FC, useState } from 'react'
import 'video.js/dist/video-js.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactJWPlayer from 'react-jw-player'
import styles from './VideoPlayer.module.scss'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'

interface VideoPlayerProps {
  videoPostMedia: PostMediaComponentDto
  onPlayerReady: () => void
  selectedMediaUrl: MediaUrlComponentDto
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  videoPostMedia,
  onPlayerReady,
  selectedMediaUrl,
}) => {
  const [videoReady, setVideoReady] = useState<boolean>(false)

  let advertising = null

  if (process.env.NEXT_PUBLIC_VIDEO_PRE_ROLL_AD_URL) {
    advertising = {
      client: 'vast',
      schedule: {
        myAds: {
          offset: 'pre',
          tag: process.env.NEXT_PUBLIC_VIDEO_PRE_ROLL_AD_URL,
        },
      },
    }
  }

  const sources = videoPostMedia.urls.map((mediaUrl) => {
    return {
      file: mediaUrl.url,
      type: 'mp4',
      label: mediaUrl.title,
    }
  })

  let customProps: { sources: any; advertising?: any } = { sources }

  if (advertising) {
    customProps = { sources, advertising }
  }

  const onReady = () => {
    setVideoReady(true)
    onPlayerReady()
  }

  return (
    <div className={ styles.videoPlayer__container }>
      { videoReady ? null : <VideoLoadingState /> }
      <ReactJWPlayer
        file={ selectedMediaUrl.url }
        playerScript={ 'https://cdn.jwplayer.com/libraries/cDnha7c4.js' }
        customProps={ customProps }
        // FIXME: Set a default thumbnailUrl if not exists
        image={ videoPostMedia.thumbnailUrl ?? '' }
        aspectRatio={ '16:9' }
        playerId={ videoPostMedia.postId }
        onReady={ onReady }
      />
    </div>
  )
}
