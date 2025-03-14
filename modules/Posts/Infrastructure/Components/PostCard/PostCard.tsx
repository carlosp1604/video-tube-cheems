import { FC, ReactElement, MouseEvent } from 'react'
import styles from './PostCard.module.scss'
import { BsDot, BsLink45Deg } from 'react-icons/bs'
import Link from 'next/link'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { useRouter } from 'next/router'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { getResolution } from '~/modules/Posts/Infrastructure/Frontend/PostCardHelper'
import {
  PostCardProducerActorNameLink
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardProducerActor/PostCardProducerActorNameLink'
import dynamic from 'next/dynamic'

const HoverVideoPlayer = dynamic(() => import('react-hover-video-player')
  .then((module) => module.default), { ssr: false }
)

const VideoLoadingState = dynamic(() => import('~/components/VideoLoadingState/VideoLoadingState')
  .then((module) => module.VideoLoadingState), { ssr: false })

interface Props {
  post: PostCardComponentDto
}

export const PostCard: FC<Props> = ({
  post,
}) => {
  const { t } = useTranslation('post_card')

  const locale = useRouter().locale ?? 'en'

  const handleVideoHover = (event: MouseEvent<HTMLAnchorElement>, title: string) => {
    event.currentTarget.setAttribute('title', title)
  }

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

  const producerNameLink: ReactElement | null = (
    <PostCardProducerActorNameLink producer={ post.producer } actor={ post.actor } />
  )

  let postCardLink = `/posts/videos/${post.slug}`
  let resolutionIcon: ReactElement | null = null
  let externalLinkIcon: ReactElement | null = null

  if (post.externalLink !== null) {
    postCardLink = post.externalLink

    externalLinkIcon = (
      <span
        className={ `${styles.postCard__absoluteElement} ${styles.postCard__externalIcon}` }
        title={ t('post_card_external_link_title') }
      >
        <BsLink45Deg />
      </span>
    )
  }

  if (post.resolution) {
    resolutionIcon = (
      <span className={ `${styles.postCard__absoluteElement} ${styles.postCard__videoResolution}` } >
        { getResolution(post.resolution) }
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
          target={ post.externalLink !== null ? '_blank' : undefined }
          onMouseOver={ (event) => handleVideoHover(event, '') }
          onMouseLeave={ (event) => handleVideoHover(event, post.title) }
        >
          { media }
          <span className={ styles.postCard__absoluteElement }>
            { post.duration }
          </span>
          { resolutionIcon }
          { externalLinkIcon }
        </Link>
      </div>
      <div className={ styles.postCard__videoDataContainer }>
        <div className={ styles.postCard__postData }>
          { producerNameLink }

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
            { t('post_card_post_views', { views: NumberFormatter.compatFormat(post.views, locale) }) }
            <BsDot className={ styles.postCard__separatorIcon }/>
            { post.date }
          </div>
        </div>
      </div>
    </div>
  )
}
