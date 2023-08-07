import { FC, ReactElement } from 'react'
import styles from './PostCard.module.scss'
import { BsDot } from 'react-icons/bs'
import Link from 'next/link'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Avatar from 'react-avatar'
import HoverVideoPlayer from 'react-hover-video-player'

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
      className={ styles.postCard__media }
      width={ 0 }
      height={ 0 }
      sizes={ '100vw' }
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
        muted={ true }
        disableRemotePlayback={ true }
        disablePictureInPicture={ true }
        loop={ true }
      />
    )
  }

  if (post.producer !== null && post.producer.imageUrl !== null && showProducerImage) {
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

  return (
    <div className={ styles.postCard__container }>
      <div className={ styles.postCard__videoContainer }>
        <p className={ styles.postCard__videoTime } >
          { post.duration }
        </p>
        <Link
          href={ `/posts/videos/${post.slug}` }
          className={ styles.postCard__videoLink }
        >
        <div className={ styles.postCard__videoWrapper }>
          { media }
        </div>
        </Link>
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
