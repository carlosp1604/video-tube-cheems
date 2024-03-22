import React, { FC, useEffect, useRef } from 'react'
import fluidPlayer from 'fluid-player'
import 'fluid-player/src/css/fluidplayer.css'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import styles from './VideoPlayer.module.scss'
import TailwindConfig from '~/tailwind.config'

interface FluidVideoPlayerProps {
  title: string
  videoPostMedia: PostMediaComponentDto
  onPlayerReady: () => void
  selectedMediaUrl: MediaUrlComponentDto
}

export const FluidVideoPlayer: FC<FluidVideoPlayerProps> = ({
  videoPostMedia,
  onPlayerReady,
  title,
}) => {
  const playerRef = useRef(null)

  let player: FluidPlayerInstance | null = null

  let vasOptions: Partial<VastOptions>

  if (process.env.NEXT_PUBLIC_VIDEO_PRE_ROLL_AD_URL) {
    vasOptions = {
      adList: [
        {
          roll: 'preRoll',
          vastTag: process.env.NEXT_PUBLIC_VIDEO_PRE_ROLL_AD_URL,
        },
      ],
    }
  }

  useEffect(() => {
    if (!player && playerRef.current) {
      player = fluidPlayer(playerRef.current, {
        layoutControls: {
          fillToContainer: true,
          posterImage: videoPostMedia.thumbnailUrl ?? false,
          posterImageSize: 'cover',
          mute: true,
          playbackRateEnabled: true,
          allowTheatre: false,
          controlBar: {
            autoHide: true,
            autoHideTimeout: 5,
            animated: false,
          },
          controlForwardBackward: {
            show: true,
            doubleTapMobile: true,
          },
          primaryColor: TailwindConfig.theme.extend.colors.brand.primary.bg,
        },
        vastOptions: vasOptions ?? undefined,
      })

      onPlayerReady()
    }
  }, [])

  return (
    <div className={ styles.videoPlayer__container }>
      <video
        ref={ playerRef }
        className={ styles.videoPlayer__player }
        title={ title }
      >
        {
          videoPostMedia.urls.map((mediaUrl) => {
            return (
              <source
                src={ mediaUrl.url }
                type="video/mp4"
                title={ mediaUrl.title }
                key={ mediaUrl.url }
                data-fluid-hd
              />
            )
          })
        }
      </video>
    </div>
  )
}
