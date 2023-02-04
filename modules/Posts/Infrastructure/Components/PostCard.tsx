import { createRef, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './PostCard.module.scss'
import { BsChatText, BsHeart, BsThreeDotsVertical } from 'react-icons/bs'
import * as React from 'react'
import Link from 'next/link'
import PlayerOptions = videojs.PlayerOptions;
import getPlayer = videojs.getPlayer;
import videojs from 'video.js'
import { SafePlayVideo, SafeStopVideo } from '../../../Shared/Infrastructure/SafeVideoElement'

interface Props {
  id: string
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
}

export const PostCard: FC<Props> = ({ id, playerId, setPlayerId }) => {
  const player = createRef<HTMLVideoElement>()
  const [playPromise, setPlayPromise] = useState<Promise<void>>(Promise.resolve())
  const [playing, setPlaying] = useState<boolean>(false)

  useEffect(() => {
    if (playerId === id && player.current) {
      SafePlayVideo(player.current, setPlayPromise)
      setPlaying(true)
      return
    }

    if (playing && player.current) {
      SafeStopVideo(player.current, playPromise)
      setPlaying(false)
    }
  })

  return (
    <div className={ styles.postCard__container }>
      <p className={ styles.postCard__videoTime } >
        30:25
      </p>
      <Link href='/posts/videos/1'>
        <div
          className={ styles.postCard__videoWrapper }
          onMouseOver={ async () =>
            player.current ? await SafePlayVideo(player.current, setPlayPromise) : ''
          }
          onMouseLeave={ () =>
            player.current ? SafeStopVideo(player.current, playPromise) : ''
          }
          onTouchMove={ () => setPlayerId(id) }
        >
          <video
            className={ styles.postCard__media }
            controls={ false }
            src='https://assets.mixkit.co/videos/preview/mixkit-aerial-shot-of-a-small-isthmus-44399-large.mp4'
            poster='https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            muted
            ref={ player }
            disableRemotePlayback={ true }
            disablePictureInPicture={ true }
          />
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