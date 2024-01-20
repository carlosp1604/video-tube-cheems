import { FC, ReactElement } from 'react'
import styles from './PostCard.module.scss'
import { BsDot } from 'react-icons/bs'
import Link from 'next/link'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import HoverVideoPlayer from 'react-hover-video-player'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { usePathname } from 'next/navigation'

interface Props {
  post: PostCardComponentDto
  showProducerImage: boolean
}

export const PostCard: FC<Props> = ({
  post,
  showProducerImage = true,
}) => {
  const { t } = useTranslation('post_card')

  const pathname = usePathname()

  const poster: ReactElement = (
    <Image
      src={ post.thumb }
      alt={ post.title }
      className={ styles.postCard__media }
      width={ 0 }
      height={ 0 }
      sizes={ '100vw' }
    />
  )

  let media: ReactElement = poster

  if (post.animation !== null) {
    media = (
      <HoverVideoPlayer
        className={ styles.postCard__media }
        videoClassName={ styles.postCard__media }
        controls={ false }
        videoSrc={ post.animation.value }
        pausedOverlay={ poster }
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

  let producerImage: ReactElement | null = null
  let producerNameLink: ReactElement | null = null

  if (post.producer !== null) {
    const producerLink = `/producers/${post.producer.slug}`

    let linkDisabled = false

    if (pathname === producerLink) {
      linkDisabled = true
    }

    if (showProducerImage) {
      producerImage = (
        <Link
          className={ `
          ${styles.postCard__producerActorAvatarLink}
          ${linkDisabled ? styles.postCard__producerActorAvatarLink__disabled : ''}
        ` }
          href={ `/producers/${post.producer.slug}` }
          title={ post.producer.name }
        >
          <AvatarImage
            imageUrl={ post.producer.imageUrl }
            imageClassName={ styles.postCard__producerActorLogo }
            avatarName={ post.producer.name }
            imageAlt={ post.producer.name }
            avatarClassName={ styles.postCard__producerActorAvatarContainer }
            color={ post.producer.brandHexColor }
          />
        </Link>
      )
    }

    producerNameLink = (
      <Link
        className={ `
          ${styles.postCard__producerName}
          ${linkDisabled ? styles.postCard__producerName__disabled : ''}
        ` }
        href={ `/producers/${post.producer.slug}` }
      >
        { post.producer.name }
      </Link>
    )
  }

  if (post.producer === null && post.actor !== null) {
    const actorLink = `/actors/${post.actor.slug}`

    let linkDisabled = false

    if (pathname === actorLink) {
      linkDisabled = true
    }

    if (showProducerImage) {
      producerImage = (
        <Link
          className={ `
          ${styles.postCard__producerActorAvatarLink}
          ${linkDisabled ? styles.postCard__producerActorAvatarLink__disabled : ''}
        ` }
          href={ `/actors/${post.actor.slug}` }
          title={ post.actor.name }
        >
          <AvatarImage
            imageUrl={ post.actor.imageUrl }
            imageClassName={ styles.postCard__producerActorLogo }
            avatarName={ post.actor.name }
            imageAlt={ post.actor.name }
            avatarClassName={ styles.postCard__producerActorAvatarContainer }
          />
        </Link>
      )
    }

    producerNameLink = (
      <Link
        className={ `
          ${styles.postCard__producerName}
          ${linkDisabled ? styles.postCard__producerName__disabled : ''}
        ` }
        href={ `/actors/${post.actor.slug}` }
      >
        { post.actor.name }
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
            { producerNameLink }
            { (post.producer !== null || post.actor !== null) ? <BsDot /> : '' }
            { t('post_card_post_views', { views: post.views }) }
            <BsDot className={ styles.postCard__separatorIcon }/>
            { post.date }
          </div>
        </div>
      </div>
    </div>
  )
}
