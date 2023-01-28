import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './PostCard.module.scss'
import { BsChatText, BsHeart, BsThreeDotsVertical } from 'react-icons/bs'
import { PreviewVideoPlayer } from '../../../../Components/PreviewVideoPlayer/PreviewVideoPlayer'
import videojs from 'video.js'
import * as React from 'react'
import Link from 'next/link'

interface Props {
  id: string
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
}

export const PostCard: FC<Props> = ({ id, playerId, setPlayerId }) => {
  const [playing, setPlaying] = useState<boolean>(false)
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

  useEffect(() => {
    const currentPlayer = videojs.getPlayer(videoNode.current ?? '')

    if (!playing) {
      if (playerId === id && currentPlayer) {
        setPlaying(true)
        currentPlayer?.play()
        currentPlayer.controlBar.addClass('active-vjs-control-bar')
      }
    }

    if (playing) {
      setPlaying(false)
      currentPlayer?.load()
      currentPlayer?.controlBar.removeClass('active-vjs-control-bar')

    }
  }, [playerId])

  return (
    <div className={ styles.postCard__container }>
      <p className={ styles.postCard__videoTime } >
        30:25
      </p>
      <Link
        href={'/'}
        className={ styles.postCard__link }
      >
        <div
          className={ styles.postCard__videoWrapper}
          onMouseOver={ () => {
            setPlayerId(id)
          }}
          onMouseLeave={ () => {
            setPlayerId('')
          }}
          onTouchMove={ () => {
            setPlayerId(id)
          }}
        >
          <PreviewVideoPlayer options={videoJsOptions} setPlayerId={setPlayerId} id={id} playerId={playerId} videoNode={videoNode}/>
        </div>
      </Link>

      <div className={ styles.postCard__videoData }>
        <p className={ styles.postCard__videoOptions } >
          <BsThreeDotsVertical />
        </p>
        <Link href={'/'}>
        <img
          className={ styles.postCard__producerLogo }
          src="https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
        </Link>
        <div className={ styles.postCard__producerTitle }>
          <Link href={'/'} className={ styles.postCard__producerNameLink }>
            Productora
          </Link>
          <Link href={'/'} className={ styles.postCard__videoTitleLink }>
            Titulo del video equisde jsjsjsasdasdassad asdas adsadasd
          </Link>
        </div>

        <div className={ styles.postCard__extraData }>
          <span className={ styles.postCard__extraDataItem }>
            18.4k
          </span>
          <span className={ styles.postCard__extraDataItem }>
            Today
          </span>
          <div className={ styles.postCard__interactionSection }>
            <BsHeart />
            65
          </div>
          <div className={ styles.postCard__interactionSection }>
            <BsChatText />
            190
          </div>
        </div>
      </div>
    </div>
  )
}