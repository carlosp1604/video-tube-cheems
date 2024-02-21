import { createRef, FC, ReactElement, useEffect, useMemo, useState } from 'react'
import styles from './VideoPostPlayer.module.scss'
import { BsFileEarmarkBreak, BsThreeDotsVertical } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import * as uuid from 'uuid'
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
import { Tooltip } from '~/components/Tooltip/Tooltip'

export interface Props {
  mediaUrls: MediaUrlComponentDto[]
  embedPostMedia: PostMediaComponentDto | null
  videoPostMedia: PostMediaComponentDto | null
}

export const VideoPostPlayer: FC<Props> = ({ mediaUrls, embedPostMedia, videoPostMedia }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')

  const selectedMediaUrl = useMemo(
    () => VideoPostPlayerHelper.getFirstMediaUrl(mediaUrls),
    [embedPostMedia, videoPostMedia])

  const [selectedUrl, setSelectedUrl] = useState<MediaUrlComponentDto | null>(selectedMediaUrl)

  const selectableUrls = useMemo(
    () => VideoPostPlayerHelper.getSelectableUrls(embedPostMedia, videoPostMedia),
    [embedPostMedia, videoPostMedia])

  const { t } = useTranslation('post')

  const iframeRef = createRef<HTMLIFrameElement>()

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
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
        className={ styles.videoPostPlayer__switcherButton }
        onClick={ () => setMenuOpen(!menuOpen) }
        title={ t('post_video_player_selector_button_title') }
        data-tooltip-id={ tooltipId }
        data-tooltip-content={ t('post_video_player_selector_button_title') }
      >
        <BsThreeDotsVertical className={ styles.videoPostPlayer__optionIcon }/>
      </button>
    )

    const onClickOption = (mediaUrl: MediaUrlComponentDto) => {
      if (selectedUrl !== mediaUrl) {
        setVideoReady(false)
        setSelectedUrl(mediaUrl)
      }
      setMenuOpen(!menuOpen)
    }

    sourcesMenu = (
      <VideoSourcesMenu
        mediaUrls={ selectableUrls }
        selectedUrl={ selectedUrl }
        onClickOption={ onClickOption }
        menuOpen={ menuOpen }
        onClickMenu={ () => setMenuOpen(!menuOpen) }
      />
    )

    sourceSelectorButtonToolTip = (
      <Tooltip
        tooltipId={ tooltipId }
        place={ 'left' }
      />
    )
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
    const sandbox = VideoPostPlayerHelper.shouldBeSanboxed(selectedUrl.provider.id)

    playerElement = (
      <iframe
        key={ selectedUrl.url }
        className={ styles.videoPostPlayer__iframe }
        ref={ iframeRef }
        src={ selectedUrl.url }
        width={ '100%' }
        height={ '100%' }
        onLoad={ onReady }
        allowFullScreen={ true }
        sandbox={ sandbox ? 'allow-same-origin allow-scripts' : undefined }
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
      { mounted && sourceSelectorButtonToolTip }
    </div>
  )
}
