import { createRef, Dispatch, FC, SetStateAction, useState, ReactElement, useEffect } from 'react'
import styles from './PostCard.module.scss'
import { BsDot } from 'react-icons/bs'
import Link from 'next/link'
import { SafePlayVideo, SafeStopVideo } from '~/modules/Shared/Infrastructure/SafeVideoElement'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

interface Props {
  playerId: string
  setPlayerId: Dispatch<SetStateAction<string>>
  post: PostCardComponentDto
  showProducerImage: boolean
}

export const PostCard: FC<Props> = ({
  post,
  playerId,
  setPlayerId,
  showProducerImage = true,
}) => {
  const player = createRef<HTMLVideoElement>()
  const [playPromise, setPlayPromise] = useState<Promise<void>>(Promise.resolve())
  const [playing, setPlaying] = useState<boolean>(false)

  const { t } = useTranslation('post_card')

  // TODO: Set a default image for producers without image
  let producerImage: ReactElement | null = null

  let media: ReactElement = (
    <Image
      src={ post.thumb }
      alt={ post.title }
      className={ styles.postCard__media }
      width={ 0 }
      height={ 0 }
      sizes={ '100vw' }
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

  if (post.producer !== null && post.producer.imageUrl && showProducerImage) {
    producerImage = (
      // TODO: FIX THIS WHEN PRODUCER PAGE IS READY
      <Link href={ '/' } title={ post.producer.name }>
        <Image
          className={ styles.postCard__producerLogo }
          src={ post.producer?.imageUrl ?? '' }
          alt={ post.producer?.name }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
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
      <div
        className={ styles.postCard__videoContainer }
        onMouseOver={ async () =>
          player.current ? await SafePlayVideo(player.current, setPlayPromise) : ''
        }
        onMouseLeave={ () =>
          player.current ? SafeStopVideo(player.current, playPromise) : ''
        }
        onTouchMove={ () => setPlayerId(post.id) }
      >
        <p className={ styles.postCard__videoTime } >
          { post.duration }
        </p>
        <Link
          href={ `/posts/videos/${post.slug}` }
          className={ styles.postCard__videoLink }
        />
        <div className={ styles.postCard__videoWrapper }>
          { media }
        </div>
      </div>

      <div className={ styles.postCard__videoDataContainer }>
        { producerImage }
        <div className={ styles.postCard__videoData }>
          <Link
            href={ `/posts/videos/${post.slug}` }
            className={ styles.postCard__videoTitleLink }
            title={ post.title }
          >
            { post.title }
          </Link>
          <div className={ styles.postCard__extraData }>
            { post.producer !== null
              ? <span className={ styles.postCard__producerName }>{ post.producer.name }</span>
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
