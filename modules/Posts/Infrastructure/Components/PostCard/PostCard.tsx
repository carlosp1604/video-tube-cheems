import { FC, ReactElement } from 'react'
import styles from './PostCard.module.scss'
import { BsDot, BsLink45Deg } from 'react-icons/bs'
import Link from 'next/link'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import HoverVideoPlayer from 'react-hover-video-player'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { usePathname } from 'next/navigation'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'

interface Props {
  post: PostCardComponentDto
  showProducerImage: boolean
}

export const PostCard: FC<Props> = ({
  post,
  showProducerImage = true,
}) => {
  const { t } = useTranslation('post_card')

  const locale = useRouter().locale ?? 'en'
  const pathname = usePathname()

  const poster: ReactElement = (
    <Image
      src={ post.thumb }
      alt={ post.title }
      className={ styles.postCard__media }
      width={ 200 }
      height={ 200 }
      sizes={ '100vw' }
      placeholder={ 'blur' }
      blurDataURL={ rgbDataURL(81, 80, 80) }
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
            priority={ false }
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

  let postCardLink = `/posts/videos/${post.slug}`
  let externalLinkIcon: ReactElement | null = null

  if (post.externalLink !== null) {
    postCardLink = post.externalLink

    externalLinkIcon = (
      <span
        className={ styles.postCard__externalIcon }
        title={ t('post_card_external_link_title') }
      >
        <BsLink45Deg />
      </span>
    )
  }

  return (
    <div className={ styles.postCard__container }>
      <div className={ `${styles.postCard__videoContainer} 
        ${post.externalLink !== null ? styles.postCard__videoContainer__external : ''}
      ` }>
        <Link
          href={ postCardLink }
          className={ styles.postCard__videoLink }
          title={ post.title }
          rel={ post.externalLink !== null ? 'nofollow' : 'follow' }
        >
          { media }
          <span className={ styles.postCard__videoTime } >
            { post.duration }
          </span>
          { externalLinkIcon }
        </Link>
      </div>

      <div className={ styles.postCard__videoDataContainer }>
        { producerImage }
        <div className={ styles.postCard__postData }>
          <Link
            href={ postCardLink }
            className={ styles.postCard__videoTitleLink }
            title={ post.title }
            rel={ post.externalLink !== null ? 'nofollow' : 'follow' }
            target={ post.externalLink !== null ? '_blank' : '_self' }
          >
            { post.title }
          </Link>
          <div className={ styles.postCard__extraData }>
            { producerNameLink }
            { (post.producer !== null || post.actor !== null) ? <BsDot /> : '' }
            { t('post_card_post_views', { views: NumberFormatter.compatFormat(post.views, locale) }) }
            <BsDot className={ styles.postCard__separatorIcon }/>
            { post.date }
          </div>
        </div>
      </div>
    </div>
  )
}
