import { createRef, FC, ReactElement, useEffect, useMemo, useState } from 'react'
import styles from './VideoPostPlayer.module.scss'
import { BsFileEarmarkBreak, BsThreeDotsVertical } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import * as uuid from 'uuid'
import { Tooltip } from 'react-tooltip'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { VideoPlayer } from '~/components/VideoPlayer/VideoPlayer'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'
import {
  VideoSourcesMenu
} from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoSourcesMenu/VideoSourcesMenu'
import {
  VideoPostPlayerHelper
} from '~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoPostPlayerHelper'

export interface Props {
  mediaUrls: MediaUrlComponentDto[]
  embedPostMedia: PostMediaComponentDto | null
  videoPostMedia: PostMediaComponentDto | null
}

export const VideoPostPlayer: FC<Props> = ({ mediaUrls, embedPostMedia, videoPostMedia }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [showVideoOptions, setShowVideoOptions] = useState<boolean>(false)

  const selectedMediaUrl = useMemo(
    () => VideoPostPlayerHelper.getFirstMediaUrl(mediaUrls),
    [embedPostMedia, videoPostMedia])
  const [selectedUrl, setSelectedUrl] = useState<MediaUrlComponentDto | null>(selectedMediaUrl)

  const selectableUrls = useMemo(
    () => VideoPostPlayerHelper.getSelectableUrls(embedPostMedia, videoPostMedia),
    [embedPostMedia, videoPostMedia])

  const { t } = useTranslation('post')

  const tooltipUuid = uuid.v4()
  const iframeRef = createRef<HTMLIFrameElement>()

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
  let sourceSelectorButtonToolTip: ReactElement | null = null
  let sourcesMenu: ReactElement | null = null

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

    sourcesMenu = (
      <VideoSourcesMenu
        mediaUrls={ selectableUrls }
        selectedUrl={ selectedUrl }
        onClickOption={ (mediaUrl) => {
          if (selectedUrl !== mediaUrl) {
            setVideoReady(false)
            setSelectedUrl(mediaUrl)
          }
          setMenuOpen(!menuOpen)
        } }
        menuOpen={ menuOpen }
        onClickMenu={ () => setMenuOpen(!menuOpen) }
      />
    )

    sourceSelectorButtonToolTip = (
      <Tooltip
        id={ tooltipUuid }
        place={ 'top' }
        positionStrategy={ 'fixed' }
      />
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

  return (
    <div className={ styles.videoPostPlayer__container }>
      { sourcesMenu }
      { !videoReady ? <VideoLoadingState /> : null }
      { playerElement }
      { sourceSelectorButton }
      { sourceSelectorButtonToolTip }
    </div>
  )
}
