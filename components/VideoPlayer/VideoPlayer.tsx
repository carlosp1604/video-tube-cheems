import { FC, ReactElement, useState } from 'react'
import 'video.js/dist/video-js.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactJWPlayer from 'react-jw-player'
import styles from './VideoPlayer.module.scss'
import { AiOutlineLoading } from 'react-icons/ai'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

interface VideoPlayerProps {
  playerId: string
  mediaUrls: MediaUrlComponentDto[]
  videoPoster: string
  onPlayerReady: () => void
  selectedMediaUrl: MediaUrlComponentDto
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  playerId,
  mediaUrls,
  videoPoster,
  onPlayerReady,
  selectedMediaUrl,
}) => {
  const [videoReady, setVideoReady] = useState<boolean>(false)

  const advertising = {
    client: 'vast',
    schedule: {
      myAds: {
        offset: 'pre',
        tag: 'https://syndication.realsrv.com/splash.php?idzone=4829926',
      },
    },
  }

  const sources = mediaUrls.map((mediaUrl) => {
    return {
      file: mediaUrl.url,
      type: 'mp4',
      label: mediaUrl.title,
    }
  })

  const onReady = () => {
    setVideoReady(true)
    onPlayerReady()
  }

  const loadingState: ReactElement | null = (
    <div className={ styles.videoPlayer__loadingState }>
      <AiOutlineLoading className={ styles.videoPlayer__loadingIcon }/>
    </div>
  )

  return (
    <div className={ styles.videoPlayer__container }>
      { videoReady ? '' : loadingState }
      <ReactJWPlayer
        file={ selectedMediaUrl }
        playerScript={ 'https://cdn.jwplayer.com/libraries/cDnha7c4.js' }
        customProps={ { sources } }
        image={ videoPoster }
        aspectRatio={ '16:9' }
        playerId={ playerId }
        onReady={ onReady }
      />
    </div>
  )
}
