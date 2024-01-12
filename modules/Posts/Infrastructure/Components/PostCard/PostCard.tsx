import { FC, ReactElement } from 'react'
import styles from './PostCard.module.scss'
import { BsDot } from 'react-icons/bs'
import Link from 'next/link'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Avatar from 'react-avatar'
import HoverVideoPlayer from 'react-hover-video-player'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'

interface Props {
  post: PostCardComponentDto
  showProducerImage: boolean
}

export const PostCard: FC<Props> = ({
  post,
  showProducerImage = true,
}) => {
  const { t } = useTranslation('post_card')

  let producerImage: ReactElement | null = null

  let media: ReactElement = (
    <Image
      src={ post.thumb }
      alt={ post.title }
      width={ 100 }
      height={ 100 }
    />
  )

  if (post.animation !== null) {
    media = (
      <HoverVideoPlayer
        className={ styles.postCard__media }
        videoClassName={ styles.postCard__media }
        controls={ false }
        videoSrc={ post.animation?.value }
        pausedOverlay={
          <Image
            src={ post.thumb }
            alt={ post.title }
            className={ styles.postCard__media }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
          />
        }
        loadingOverlay={ <VideoLoadingState /> }
        muted={ true }
        disableRemotePlayback={ true }
        disablePictureInPicture={ true }
        loop={ true }
        preload={ 'metadata' }
        unloadVideoOnPaused={ true }
        playbackStartDelay={ 0 }
      />
    )
  }

  if (post.producer !== null && post.producer.imageUrl !== null && showProducerImage) {
    producerImage = (
      // TODO: FIX THIS WHEN PRODUCER PAGE IS READY
      <Link href={ '/' } title={ post.producer.name }>
        <Image
          className={ styles.postCard__producerLogo }
          src={ post.producer.imageUrl }
          alt={ post.producer?.name }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      </Link>
    )
  }

  if (post.producer !== null && post.producer.imageUrl === null && showProducerImage) {
    producerImage = (
      <Link
        className={ styles.postCard__producerAvatarContainer }
        href={ '/' }
        title={ post.producer.name }
      >
        <Avatar
          name={ post.producer.name }
          size={ '40' }
          round={ true }
        />
      </Link>
    )
  }

  if (post.producer === null && post.actor !== null && post.actor.imageUrl !== null && showProducerImage) {
    producerImage = (
      <Link href={ `/actors/${post.actor.slug}` } title={ post.actor.name }>
        <Image
          className={ styles.postCard__producerLogo }
          src={ post.actor.imageUrl }
          alt={ post.actor?.name }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      </Link>
    )
  }

  if (post.producer === null && post.actor && post.actor.imageUrl === null && showProducerImage) {
    producerImage = (
      <Link
        className={ styles.postCard__producerAvatarContainer }
        href={ `/actors/${post.actor.slug}` }
        title={ post.actor.name }
      >
        <Avatar
          name={ post.actor.name }
          size={ '40' }
          round={ true }
        />
      </Link>
    )
  }

  return (
    <div className={ styles.postCard__container }>
      <div className={ styles.postCard__videoContainer }>
        <Link
          href={ `/posts/videos/${post.slug}` }
          className={ styles.postCard__videoLink }
        >
          { media }
          <span className={ styles.postCard__videoTime } >
            { post.duration }
          </span>
        </Link>
      </div>

      <div className={ styles.postCard__videoDataContainer }>
        { producerImage }
        <div className={ styles.postCard__postData }>
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
            { post.producer === null && post.actor !== null
              ? <Link
                className={ styles.postCard__producerName }
                href={ `/actors/${post.actor.slug}` }
              >
                { post.actor.name }
              </Link>
              : '' }
            { post.producer !== null || post.actor !== null ? <BsDot /> : '' }
            { t('post_card_post_views', { views: post.views }) }
            <BsDot className={ styles.postCard__separatorIcon }/>
            { post.date }
          </div>
        </div>
      </div>
    </div>
  )
}
