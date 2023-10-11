import { createRef, FC, ReactElement, useEffect, useState } from 'react'
import { VideoEmbedUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'
import styles from './VideoEmbedPlayer.module.scss'
import Image from 'next/image'
import { BsPlay, BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from 'next-i18next'
import * as uuid from 'uuid'
import { Tooltip } from 'react-tooltip'

export interface Props {
  videoEmbedUrls: VideoEmbedUrlComponentDto[]
}

export const VideoEmbedPlayer: FC<Props> = ({ videoEmbedUrls }) => {
  const [selectedUrl, setSelectedUrl] = useState<VideoEmbedUrlComponentDto>(videoEmbedUrls[0])
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [showVideoOptions, setShowVideoOptions] = useState<boolean>(false)
  const iframeRef = createRef<HTMLIFrameElement>()

  const { t } = useTranslation('post')
  const tooltipUuid = uuid.v4()

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = selectedUrl.url
    }
  }, [])

  let sourceSelectorButton: ReactElement | null = null

  if (videoEmbedUrls.length > 1) {
    sourceSelectorButton = (
      <button
        className={ `
          ${styles.videoEmbedPlayer__switcherButton}
          ${showVideoOptions ? styles.videoEmbedPlayer__switcherButton_visible : ''}
         ` }
        onClick={ () => setMenuOpen(!menuOpen) }
        title={ t('post_video_embed_player_selector_button_title') }
        data-tooltip-id={ tooltipUuid }
        data-tooltip-content={ t('post_video_embed_player_selector_button_title') }
      >
        <BsThreeDotsVertical className={ styles.videoEmbedPlayer__optionIcon }/>
      </button>
    )
  }

  const handleIframeEvents = async () => {
    setShowVideoOptions(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setShowVideoOptions(false)
  }

  const onReady = () => {
    setVideoReady(true)
  }

  const loadingState: ReactElement | null = (
    <div className={ styles.videoEmbedPlayer__loadingState }>
      <AiOutlineLoading className={ styles.videoEmbedPlayer__loadingIcon }/>
    </div>
  )

  return (
    <div className={ styles.videoEmbedPlayer__container }>
      <div className={ `
        ${styles.videoEmbedPlayer__optionsContainer}
        ${menuOpen ? styles.videoEmbedPlayer__optionsContainer__open : ''}
      ` }
        onClick={ () => setMenuOpen(false) }
      >
        <div className={ styles.videoEmbedPlayer__titleSection }>
          <span className={ styles.videoEmbedPlayer__iconWrapper }>
            <BsPlay className={ styles.videoEmbedPlayer__icon }/>
          </span>
          <span className={ styles.videoEmbedPlayer__title }>
            { t('post_video_embed_player_sources_menu_title') }
            <small className={ styles.videoEmbedPlayer__subtitle }>
              { t('post_video_embed_player_sources_menu_subtitle') }
            </small>
          </span>
        </div>

        <div className={ styles.videoEmbedPlayer__optionsContainerOptionList }>
          { videoEmbedUrls.map((embedUrl) => {
            return (
              <button
                key={ embedUrl.url }
                className={ `
                ${styles.videoEmbedPlayer__optionItem}
                ${menuOpen ? styles.videoEmbedPlayer__optionItem__open : ''}
                ${selectedUrl.url === embedUrl.url ? styles.videoEmbedPlayer__optionItem__selected : ''}
              ` }
                onClick={ () => {
                  if (selectedUrl !== embedUrl) {
                    setVideoReady(false)
                    setSelectedUrl(embedUrl)
                  }
                  setMenuOpen(!menuOpen)
                } }
              >
                <Image
                  src={ embedUrl.logoUrl }
                  alt={ embedUrl.name }
                  className={ styles.videoEmbedPlayer__optionLogo }
                  width={ 0 }
                  height={ 0 }
                  sizes={ '100vw' }
                />
                <span>
                { embedUrl.name }
              </span>
              </button>
            )
          }) }
        </div>

      </div>
      { !videoReady ? loadingState : '' }

      <iframe
        ref={ iframeRef }
        src={ selectedUrl.url }
        width={ '100%' }
        height={ '100%' }
        onLoad={ onReady }
        onTouchMove={ handleIframeEvents }
        allowFullScreen={ true }
      />
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
