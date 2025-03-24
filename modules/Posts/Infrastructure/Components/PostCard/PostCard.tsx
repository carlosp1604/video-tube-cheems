import Link from 'next/link'
import Image from 'next/image'
import styles from './PostCard.module.scss'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { useIsHovered } from '~/hooks/HoverComponent'
import { getResolution } from '~/modules/Posts/Infrastructure/Frontend/PostCardHelper'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { BsLink45Deg } from 'react-icons/bs'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { FC, ReactElement, MouseEvent, useState, useRef } from 'react'
import {
  PostCardProducerActorNameLink
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardProducerActor/PostCardProducerActorNameLink'

const HoverVideoPlayer = dynamic(() => import('react-hover-video-player')
  .then((module) => module.default), { ssr: false }
)

const VideoLoadingState = dynamic(() => import('~/components/VideoLoadingState/VideoLoadingState')
  .then((module) => module.VideoLoadingState), { ssr: false })

interface Props {
  post: PostCardComponentDto
}

export interface PostCardOptionalProps {
  showExtraData: boolean
  showData: boolean
  preloadImage: boolean
}

export const PostCard: FC<Props & Partial<PostCardOptionalProps>> = ({
  post,
  showExtraData = true,
  showData = true,
  preloadImage = false,
}) => {
  const { t, lang } = useTranslation('post_card')
  const [loaded, setLoaded] = useState<boolean>(false)
  const [playing, setPlaying] = useState<boolean>(false)

  const videoContainerRef = useRef<HTMLDivElement>(null)

  useIsHovered(videoContainerRef, () => setPlaying(false))

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
      priority={ preloadImage }
    />
  )

  let media: ReactElement = poster

  if (post.animation !== null && loaded) {
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
        focused={ playing }
      />
    )
  }

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

  const extraData = (
    <div className={ styles.postCard__extraData }>
      { t('post_card_post_views', { views: NumberFormatter.compatFormat(post.views, lang) }) }
      <div className={ styles.postCard__separatorIcon }>•</div>
      { post.date }
    </div>
  )

  const postData = (
    <div className={ styles.postCard__videoDataContainer }>
      <div className={ styles.postCard__postData }>
        <PostCardProducerActorNameLink producer={ post.producer } actor={ post.actor }/>
        <Link
          prefetch={ false }
          href={ postCardLink }
          className={ styles.postCard__videoTitleLink }
          title={ post.title }
          rel={ post.externalLink !== null ? 'nofollow' : 'follow' }
          target={ post.externalLink !== null ? '_blank' : '_self' }
        >
          { post.title }
        </Link>
        { showExtraData && extraData }
      </div>
    </div>
  )

  return (
    <div className={ styles.postCard__container }>
      <div
        className={ styles.postCard__videoContainer }
        onMouseOver={ () => {
          !loaded && setLoaded(true)
          setPlaying(true)
        } }
        onTouchStart={ () => {
          !loaded && setLoaded(true)
          setPlaying(true)
        } }
        ref={ videoContainerRef }
      >
        <Link
          prefetch={ false }
          href={ postCardLink }
          className={ styles.postCard__videoLink }
          title={ post.title }
          rel={ post.externalLink !== null ? 'nofollow' : 'follow' }
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
      { showData && postData }
    </div>
  )
}
