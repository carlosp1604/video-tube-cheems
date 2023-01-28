import * as React from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { Dispatch, RefObject, SetStateAction, useEffect } from 'react'

interface VideoPlayerProps {
  options: videojs.PlayerOptions
  id: string
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
  videoNode: RefObject<HTMLVideoElement>
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
  inactivityTimeout: 1000000,
  controlBar: {
    playToggle: false,
    liveDisplay: true,
    fullscreenToggle: false,
    pictureInPictureToggle: false,
    volumePanel: {
      volumeControl: {
        vertical: false
      }
    }
  },
}

export const PreviewVideoPlayer: React.FC<VideoPlayerProps> = ({ options, playerId, setPlayerId, id, videoNode }) => {
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
      preload={'none'}
      ref={ videoNode }
      className="video-js"
      muted
    />
  )
}