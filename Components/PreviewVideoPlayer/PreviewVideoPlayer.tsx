import * as React from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { RefObject, useEffect } from 'react'

interface VideoPlayerProps {
  options: videojs.PlayerOptions
  videoNode: RefObject<HTMLVideoElement>
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
}

export const PreviewVideoPlayer: React.FC<VideoPlayerProps> = ({ options, videoNode }) => {
  const player = React.useRef<videojs.Player>()

  useEffect(() => {
    const currentPlayer = videojs.getPlayer(videoNode.current ?? '')

    if (!currentPlayer && videoNode.current) {
      player.current = videojs(videoNode.current, {
        ...initialOptions,
        ...options
      }).ready(function() {})

      return () => {
        if (player.current) {
          player.current.dispose()
        }
      }
    }
  }, [options])

  return (
    <video
      preload='none'
      ref={ videoNode }
      className="video-js"
      muted
    />
  )
}