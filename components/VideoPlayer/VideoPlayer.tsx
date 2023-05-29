import { FC } from 'react'
import 'video.js/dist/video-js.css'
import ReactJWPlayer from 'react-jw-player'
import styles from './VideoPlayer.module.scss'
import { VideoQualityDto } from '~/modules/Posts/Infrastructure/Dtos/VideoComponentDto'
import { useSession } from 'next-auth/react'

interface VideoPlayerProps {
  videoQualities: VideoQualityDto[]
  videoPoster: string
  videoId: string
  onVideoPlay: () => void
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ videoQualities, videoPoster, onVideoPlay, videoId }) => {
  const { data } = useSession()

  const advertising = {
    client: 'vast',
    schedule: {
      myAds: {
        offset: 'pre',
        tag: 'https://syndication.realsrv.com/splash.php?idzone=4829926',
      },
    },
  }

  const sources = videoQualities.map((quality) => {
    return {
      file: quality.value,
      type: 'mp4',
      label: quality.title,
    }
  })

  const onPlay = async () => {
    let userId: string | null = null

    if (data !== null) {
      userId = data.user.id
    }

    try {
      await fetch(`/api/posts/${videoId}/post-views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: videoId,
          userId,
        }),
      })

      onVideoPlay()
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  return (
    <div className={ styles.videoPlayer__container }>
      <ReactJWPlayer
        file={ videoQualities[0].value }
        playerId={ videoId }
        playerScript={ 'https://cdn.jwplayer.com/libraries/cDnha7c4.js' }
        customProps={ { sources } }
        image={ videoPoster }
        onPlay={ onPlay }
      />
    </div>
  )
}
