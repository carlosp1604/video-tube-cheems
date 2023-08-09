import { FC, ReactElement, useState } from 'react'
import 'video.js/dist/video-js.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactJWPlayer from 'react-jw-player'
import styles from './VideoPlayer.module.scss'
import { VideoQualityDto } from '~/modules/Posts/Infrastructure/Dtos/VideoComponentDto'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { AiOutlineLoading } from 'react-icons/ai'

interface VideoPlayerProps {
  videoQualities: VideoQualityDto[]
  videoPoster: string
  videoId: string
  onVideoPlay: () => void
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ videoQualities, videoPoster, onVideoPlay, videoId }) => {
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

  const postsApiService = new PostsApiService()

  const sources = videoQualities.map((quality) => {
    return {
      file: quality.value,
      type: 'mp4',
      label: quality.title,
    }
  })

  const onPlay = async () => {
    try {
      await postsApiService.addPostView(videoId)

      onVideoPlay()
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  const onReady = () => {
    setVideoReady(true)
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
        file={ videoQualities[0].value }
        playerId={ videoId }
        playerScript={ 'https://cdn.jwplayer.com/libraries/cDnha7c4.js' }
        customProps={ { sources } }
        image={ videoPoster }
        onPlay={ onPlay }
        aspectRatio={ '16:9' }
        onReady={ onReady }
      />
    </div>
  )
}
