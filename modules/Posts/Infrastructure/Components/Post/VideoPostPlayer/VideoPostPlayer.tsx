import { createRef, FC, ReactElement, useEffect, useMemo, useState } from 'react'
import styles from './VideoPostPlayer.module.scss'
import Image from 'next/image'
import { BsFileEarmarkBreak, BsPlay, BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from 'next-i18next'
import * as uuid from 'uuid'
import { Tooltip } from 'react-tooltip'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { VideoPlayer } from '~/components/VideoPlayer/VideoPlayer'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'

export interface Props {
  mediaUrls: MediaUrlComponentDto[]
  embedPostMedia: PostMediaComponentDto | null
  videoPostMedia: PostMediaComponentDto | null
}

export const VideoPostPlayer: FC<Props> = ({ mediaUrls, embedPostMedia, videoPostMedia }) => {
  const getSelectablesUrls = (): MediaUrlComponentDto[] => {
    let mediaUrls: MediaUrlComponentDto[] = []

    if (embedPostMedia !== null) {
      mediaUrls = [...mediaUrls, ...embedPostMedia.urls]
    }

    if (videoPostMedia !== null && videoPostMedia.urls.length > 0) {
      mediaUrls = [...mediaUrls, videoPostMedia.urls[0]]
    }

    return mediaUrls
  }

  const getFirstMediaUrl = (): MediaUrlComponentDto | null => {
    if (mediaUrls.length === 0) {
      return null
    }

    return mediaUrls[0]
  }

  const selectedMediaUrl = useMemo(() => getFirstMediaUrl(), [embedPostMedia, videoPostMedia])
  const selectableUrls = useMemo(() => getSelectablesUrls(), [embedPostMedia, videoPostMedia])

  const [selectedUrl, setSelectedUrl] = useState<MediaUrlComponentDto | null>(selectedMediaUrl)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [showVideoOptions, setShowVideoOptions] = useState<boolean>(false)
  const iframeRef = createRef<HTMLIFrameElement>()

  const { t } = useTranslation('post')
  const tooltipUuid = uuid.v4()

  useEffect(() => {
    if (iframeRef.current && selectedUrl) {
      iframeRef.current.src = selectedUrl.url
    }
  }, [])

  if (mediaUrls.length === 0) {
    return (
      <div className={ styles.videoPostPlayer__noSourcesState }>
        <BsFileEarmarkBreak className={ styles.videoPostPlayer__noSourcesStateIcon }/>
        { t('post_video_no_sources_error_message') }
      </div>
    )
  }

  let sourceSelectorButton: ReactElement | null = null

  if (selectableUrls.length > 1) {
    sourceSelectorButton = (
      <button
        className={ `
          ${styles.videoPostPlayer__switcherButton}
          ${showVideoOptions ? styles.videoPostPlayer__switcherButton_visible : ''}
         ` }
        onClick={ () => setMenuOpen(!menuOpen) }
        title={ t('post_video_player_selector_button_title') }
        data-tooltip-id={ tooltipUuid }
        data-tooltip-content={ t('post_video_player_selector_button_title') }
      >
        <BsThreeDotsVertical className={ styles.videoPostPlayer__optionIcon }/>
      </button>
    )
  }

  // TODO: Fix this on mobile
  const handleIframeEvents = async () => {
    setShowVideoOptions(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setShowVideoOptions(false)
  }

  const onReady = () => {
    setVideoReady(true)
  }

  const loadingState: ReactElement | null = (
    <div className={ styles.videoPostPlayer__loadingState }>
      <AiOutlineLoading className={ styles.videoPostPlayer__loadingIcon }/>
    </div>
  )

  let playerElement: ReactElement | null = null

  if (
    selectedUrl &&
    embedPostMedia &&
    embedPostMedia.urls.includes(selectedUrl)
  ) {
    playerElement = (
      <iframe
        className={ styles.videoPostPlayer__iframe }
        ref={ iframeRef }
        src={ selectedUrl.url }
        width={ '100%' }
        height={ '100%' }
        onLoad={ onReady }
        onTouchMove={ handleIframeEvents }
        allowFullScreen={ true }
      />
    )
  }

  if (
    selectedUrl &&
    videoPostMedia &&
    videoPostMedia.urls.includes(selectedUrl)
  ) {
    playerElement = (
      <VideoPlayer
        videoPostMedia={ videoPostMedia }
        selectedMediaUrl={ selectedUrl }
        onPlayerReady={ onReady }
      />
    )
  }

  const optionElements: ReactElement[] = selectableUrls.map((mediaUrl) => {
    return (
      <button
        key={ mediaUrl.url }
        className={ `
          ${styles.videoPostPlayer__optionItem}
          ${menuOpen ? styles.videoPostPlayer__optionItem__open : ''}
          ${selectedUrl && selectedUrl.url === mediaUrl.url ? styles.videoPostPlayer__optionItem__selected : ''}
        ` }
        onClick={ () => {
          if (selectedUrl !== mediaUrl) {
            setVideoReady(false)
            setSelectedUrl(mediaUrl)
          }
          setMenuOpen(!menuOpen)
        } }
      >
        <Image
          src={ mediaUrl.provider.logoUrl }
          alt={ mediaUrl.provider.name }
          className={ styles.videoPostPlayer__optionLogo }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
        <span>
          { mediaUrl.provider.name }
        </span>
      </button>
    )
  })

  return (
    <div className={ styles.videoPostPlayer__container }>
      <div className={ `
        ${styles.videoPostPlayer__optionsContainer}
        ${menuOpen ? styles.videoPostPlayer__optionsContainer__open : ''}
      ` }
        onClick={ () => setMenuOpen(false) }
      >
        <div className={ styles.videoPostPlayer__titleSection }>
          <span className={ styles.videoPostPlayer__iconWrapper }>
            <BsPlay className={ styles.videoPostPlayer__icon }/>
          </span>
          <span className={ styles.videoPostPlayer__title }>
            { t('post_video_player_sources_menu_title') }
            <small className={ styles.videoPostPlayer__subtitle }>
              { t('post_video_player_sources_menu_subtitle') }
            </small>
          </span>
        </div>

        <div className={ styles.videoPostPlayer__optionsContainerOptionList }>
          { optionElements }
        </div>

      </div>
      { !videoReady ? loadingState : '' }

      { playerElement }
      { sourceSelectorButton }
      { sourceSelectorButton !== null
        ? <Tooltip
          id={ tooltipUuid }
          place={ 'top' }
          positionStrategy={ 'fixed' }
        />
        : null
      }
    </div>
  )
}
