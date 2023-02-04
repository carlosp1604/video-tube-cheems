import { NextPage } from 'next'
import { PreviewVideoPlayer } from '../../../../Components/PreviewVideoPlayer/PreviewVideoPlayer'
import * as React from 'react'
import videojs from 'video.js'
import styles from './VideoPage.module.scss'
export const VideoPage: NextPage = () => {
  const videoNode = React.useRef<HTMLVideoElement>(null)

  const videoJsOptions: videojs.PlayerOptions = {
    sources: [
      {
        src: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
        type: 'video/mp4'
      }
    ],
    poster: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  }

  return (
    <div className={ styles.videoPage__container }>
      <PreviewVideoPlayer options={videoJsOptions} videoNode={videoNode}/>
      
      <h1>
        Un titulo
      </h1>
      <p>
        Una descripción
      </p>
    </div>
  )
}