import { createRef, FC, ReactElement, useEffect, useMemo, useState } from 'react'
import styles from './VideoPostPlayer.module.scss'
import { BsFileEarmarkBreak, BsThreeDotsVertical } from 'react-icons/bs'
import useTranslation from 'next-translate/useTranslation'
import { v4 as uuidv4 } from 'uuid'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import { VideoLoadingState } from '~/components/VideoLoadingState/VideoLoadingState'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import { useSession } from 'next-auth/react'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import { useFirstRender } from '~/hooks/FirstRender'
import { HtmlVideoPlayer } from '~/components/VideoPlayer/HtmlVideoPlayer'
import ReactGA from 'react-ga4'
import {
  ChangeVideoPlayerSourceAction,
  VideoPostCategory
} from '~/modules/Shared/Infrastructure/FrontEnd/AnalyticsEvents/PostPage'
import dynamic from 'next/dynamic'

export interface Props {
  title: string
  embedPostMedia: PostMediaComponentDto | null
  videoPostMedia: PostMediaComponentDto | null
}

const VideoSourcesMenu = dynamic(() =>
  import('~/modules/Posts/Infrastructure/Components/Post/VideoPostPlayer/VideoSourcesMenu/VideoSourcesMenu')
    .then((module) => module.VideoSourcesMenu),
{ ssr: false }
)

export const VideoPostPlayer: FC<Props> = ({ embedPostMedia, videoPostMedia, title }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const [adOpen, setAdOpen] = useState<boolean>(true)

  const { status, data } = useSession()
  const firstRender = useFirstRender()

  const selectableUrls = useMemo(
    () => {
      let userId: string | null = null

      if (status === 'authenticated' && data) {
        userId = data.user.id
      }

      return MediaUrlsHelper.getSelectableUrls(embedPostMedia, videoPostMedia, userId)
    },
    [embedPostMedia, videoPostMedia, status])

  const selectedMediaUrl = useMemo(
    () => {
      if (selectableUrls.length > 0) {
        return selectableUrls[0]
      }

      return null
    },
    [selectableUrls, status])

  const [selectedUrl, setSelectedUrl] =
    useState<MediaUrlComponentDto | null>(selectedMediaUrl)

  const { t } = useTranslation('post')

  const iframeRef = createRef<HTMLIFrameElement>()

  useEffect(() => {
    if (firstRender) {
      setVideoReady(true)
    }

    setMounted(true)
    setTooltipId(uuidv4())
  }, [])

  useEffect(() => {
    setSelectedUrl(selectedMediaUrl)
  }, [status])

  if (selectableUrls.length === 0) {
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

        ReactGA.event({
          category: VideoPostCategory,
          action: ChangeVideoPlayerSourceAction,
          label: mediaUrl.provider.name,
        })
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
    const sandbox = MediaUrlsHelper.shouldBeSanboxed(selectedUrl.provider.id)

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
        style={ { overflow: 'hidden' } }
        title={ title }
      />
    )
  }

  if (
    selectedUrl &&
    videoPostMedia &&
    videoPostMedia.urls.includes(selectedUrl)
  ) {
    playerElement = (
      <HtmlVideoPlayer
        title={ title }
        videoPostMedia={ videoPostMedia }
        selectedMediaUrl={ selectedUrl }
        onPlayerReady={ onReady }
      />
    )
  }

  const overlay = (
    <div
      className={ styles.videoPostPlayer__overlayContaier }
      id={ 'video-player-overlay' }
      onClick={ () => {
        setAdOpen(false)
      } }
    />
  )

  let shouldShowExtraAds = true

  if (selectedUrl) {
    shouldShowExtraAds = MediaUrlsHelper.shouldShowExtraAdvertising(selectedUrl?.provider.id)
  }

  return (
    <div className={ styles.videoPostPlayer__container }>
      { adOpen && shouldShowExtraAds && overlay }
      { sourcesMenu }
      { !videoReady ? <VideoLoadingState /> : null }
      { playerElement }
      { sourceSelectorButton }
      { mounted && sourceSelectorButtonToolTip }
    </div>
  )
}
