import { createRef, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './PostCard.module.scss'
import { BsHeart, BsThreeDotsVertical } from 'react-icons/bs'
import { ReactElement } from 'react'
import Link from 'next/link'
import { SafePlayVideo, SafeStopVideo } from '../../../Shared/Infrastructure/SafeVideoElement'
import { PostCardComponentDto } from '../Dtos/PostCardComponentDto'

interface Props {
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
  post: PostCardComponentDto
}

export const PostCard: FC<Props> = ({ post, playerId, setPlayerId }) => {
  const player = createRef<HTMLVideoElement>()
  const [playPromise, setPlayPromise] = useState<Promise<void>>(Promise.resolve())
  const [playing, setPlaying] = useState<boolean>(false)

  let producerImage: ReactElement | string = ''

  let media: ReactElement = (
    <img 
      src={post.thumb}
      alt={post.title}
      className={ styles.postCard__media }
    />
  )

  if (post.animation !== null) {
    media = (
      <video
        className={ styles.postCard__media }
        controls={ false }
        src={ post.animation?.value }
        poster={ post.thumb }
        muted
        ref={ player }
        disableRemotePlayback={ true }
        disablePictureInPicture={ true }
        loop={ true }
      />
    )
  }

  if (post.producer?.imageUrl) {
    producerImage = (
      <Link href={'/'}>
        <img
          className={ styles.postCard__producerLogo }
          src={post.producer?.imageUrl ?? ''}
        />
      </Link>
    )
  }

  useEffect(() => {
    if (playerId === post.id && player.current) {
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
        { post.duration }
      </p>
      <Link href={`/posts/videos/${post.id}`}>
        <div
          className={ styles.postCard__videoWrapper }
          onMouseOver={ async () =>
            player.current ? await SafePlayVideo(player.current, setPlayPromise) : ''
          }
          onMouseLeave={ () =>
            player.current ? SafeStopVideo(player.current, playPromise) : ''
          }
          onTouchMove={ () => setPlayerId(post.id) }
        >
          { media }
        </div>
      </Link>

      <div className={ styles.postCard__videoData }>
        <p className={ styles.postCard__videoOptions } >
          <BsThreeDotsVertical className={ styles.postCard__optionsIcon }/>
        </p>
        { producerImage }
        <div className={ styles.postCard__producerTitle }>
          <Link href={'/'} className={ styles.postCard__producerNameLink }>
            {post.producer?.name}
          </Link>
          <Link href={'/'} className={ styles.postCard__videoTitleLink }>
            { post.title }
          </Link>
        </div>

        <div className={ styles.postCard__extraData }>
          <span className={ styles.postCard__extraDataItem }>
            {post.views}
          </span>
          <span className={ styles.postCard__extraDataItem }>
            { post.date }
          </span>
          <div className={ styles.postCard__interactionSection }>
            <BsHeart />
            { post.reactions }
          </div>
          { // TODO: Support comments
            //<div className={ styles.postCard__interactionSection }>
              //<BsChatText />
              //190
            //</div>
          }
        </div>
      </div>
    </div>
  )
}