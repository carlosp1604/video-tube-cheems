import { createRef, Dispatch, FC, SetStateAction, useState, ReactElement, useEffect } from 'react'
import styles from './PostCard.module.scss'
import { BsDot } from 'react-icons/bs'
import Link from 'next/link'
import { SafePlayVideo, SafeStopVideo } from '~/modules/Shared/Infrastructure/SafeVideoElement'
import Avatar from 'react-avatar'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'

interface Props {
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
  post: PostCardComponentDto
}

export const PostCard: FC<Props> = ({ post, playerId, setPlayerId }) => {
  const player = createRef<HTMLVideoElement>()
  const [playPromise, setPlayPromise] = useState<Promise<void>>(Promise.resolve())
  const [playing, setPlaying] = useState<boolean>(false)

  const { t } = useTranslation('post_card')

  let producerImage: ReactElement

  let media: ReactElement = (
    <img
      src={ post.thumb }
      alt={ post.title }
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

  if (post.producer !== null && post.producer.imageUrl) {
    producerImage = (
      <Link href={ '/' } title={ post.producer.name }>
        <img
          className={ styles.postCard__producerLogo }
          src={ post.producer?.imageUrl ?? '' }
          alt={ post.producer?.name }
        />
      </Link>
    )
  } else {
    producerImage = (
      <Avatar
        className={ styles.postCard__producerLogo }
        round={ true }
        size={ '40' }
        name={ post.producer !== null ? post.producer.name : 'No Producer' }
        textSizeRatio={ 2 }
      />
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
      <Link
        href={ `/posts/videos/${post.id}` }
        title={ post.title }
      >
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
        { /*
        <p className={ styles.postCard__videoOptions } >
          <BsThreeDotsVertical className={ styles.postCard__optionsIcon }/>
        </p>
        */ }
        { producerImage }
        <div className={ styles.postCard__videoTitle }>
          <Link href={ '/' } className={ styles.postCard__videoTitleLink }>
            { post.title }
          </Link>
          <div className={ styles.postCard__extraData }>
            { post.producer !== null
              ? <span className={ styles.postCard__producerNameLink }>{ post.producer.name }</span>
              : '' }
            { post.producer !== null ? <BsDot /> : '' }
            { t('post_card_post_views', { views: post.views }) }
            <BsDot className={ styles.commentCard__separatorIcon }/>
            { post.date }
          </div>
        </div>
      </div>
    </div>
  )
}
