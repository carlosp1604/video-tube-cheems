import { FC, ReactElement, useState } from 'react'
import styles from './VideoPostPlayer.module.scss'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { HtmlVideoPlayer } from '~/components/VideoPlayer/HtmlVideoPlayer'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import { BsThreeDots, BsX } from 'react-icons/bs'
import { IconButton } from '~/components/IconButton/IconButton'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { RxGear } from 'react-icons/rx'
import { useAdBlockDetector } from '~/hooks/AdBlockDetector'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { IoReload } from 'react-icons/io5'

export interface Props {
  title: string
  selectableUrls: MediaUrlComponentDto[]
  sourcesMenuOpen: boolean
  onCloseSourceMenu: () => void
}

export interface VideoPostPlayerOptionalProps {
  setSourcesMenuOpen: (open: boolean) => void
}

export const VideoPostPlayer: FC<Props & Partial<VideoPostPlayerOptionalProps>> = ({
  title,
  selectableUrls,
  sourcesMenuOpen,
  onCloseSourceMenu,
  setSourcesMenuOpen = undefined,
}) => {
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<MediaUrlComponentDto>(selectableUrls[0])
  const { t } = useTranslation('post')

  const isBlocked = useAdBlockDetector()

  let playerElement: ReactElement | null = null

  if (selectedMediaUrl.mediaType === 'Embed') {
    playerElement = (
      <iframe
        className={ styles.videoPostPlayer__iframe }
        key={ selectedMediaUrl.url }
        src={ selectedMediaUrl.url }
        width={ '100%' }
        height={ '100%' }
        allowFullScreen={ true }
        style={ { overflow: 'hidden' } }
        title={ title }
        scrolling={ 'no' }
      />
    )
  }

  if (selectedMediaUrl.mediaType === 'Video') {
    playerElement = (
      <HtmlVideoPlayer
        title={ title }
        videoPostMediaUrls={ selectableUrls.filter((selectableUrl) => selectableUrl.mediaType === 'Video') }
        selectedMediaUrl={ selectedMediaUrl }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onPlayerReady={ () => {} }
      />
    )
  }

  const closeVideoSourceMenuButton = (
    <span className={ styles.videoPostPlayer__sourcesMenuCloseButton }>
      <IconButton
        onClick={ onCloseSourceMenu }
        icon={ <BsX /> }
        title={ t('post_sources_menu_close_button_title') }
      />
    </span>
  )

  if (isBlocked) {
    return (
      <div className={ styles.videoPostPlayer__container }>
        <div className={ styles.videoPostPlayer__blockedContentContainer }>
          <Image
            src={ '/img/ad-block.png' }
            alt={ t('post_ad_blocker_image_alt_title') }
            className={ styles.videoPostPlayer__blockedImageWrapper }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
            placeholder={ 'blur' }
            blurDataURL={ rgbDataURL(81, 80, 80) }
            priority={ true }
          />
          <p className={ styles.videoPostPlayer__blockedMessage }>
            { t('post_ad_blocker_message_title') }
          </p>
          <CommonButton
            title={ t('post_ad_blocker_reload_button_title') }
            disabled={ false }
            icon={ <IoReload /> }
            onClick={ () => window.location.reload() }
          />
        </div>
      </div>
    )
  }

  return (
    <div className={ styles.videoPostPlayer__container }>
      {
        setSourcesMenuOpen
          ? <span className={ styles.videoPostPlayer__floatingMenuButton }>
            <IconButton
              onClick={ () => setSourcesMenuOpen(!sourcesMenuOpen) }
              icon={ <BsThreeDots/> }
              title={ t('post_sources_button_title') }
              showTooltip={ true }
            />
          </span>
          : null
      }

      <div
        className={ `
          ${styles.videoPostPlayer__sourcesMenuContainer} 
          ${sourcesMenuOpen ? styles.videoPostPlayer__sourcesMenuContainer__visible : ''}
        ` }
        onClick={ onCloseSourceMenu }
      >
        <ModalMenuHeader
          title={ t('post_video_player_sources_menu_title') }
            subtitle={ t('post_video_player_sources_menu_subtitle') }
            icon={ <RxGear/> }
          />
          <div className={ styles.videoPostPlayer__sourcesMenuList }>
            { selectableUrls.map((selectableUrl) => (
              <button
                key={ selectableUrl.url }
                className={ `
              ${styles.videoPostPlayer__sourceOption} 
              ${selectedMediaUrl.url === selectableUrl.url ? styles.videoPostPlayer__sourceOption__selected : ''}
            ` }
                onClick={ async () => {
                  setSelectedMediaUrl(selectableUrl)
                } }
              >
                <div className={ styles.videoPostPlayer__sourceOptionImageWrapper }>
                  <Image
                    src={ selectableUrl.provider.logoUrl }
                    alt={ selectableUrl.provider.name }
                    className={ styles.videoPostPlayer__sourceOptionImage }
                    width={ 0 }
                    height={ 0 }
                    sizes={ '100vw' }
                    placeholder={ 'blur' }
                    blurDataURL={ rgbDataURL(81, 80, 80) }
                  />
                </div>
                { selectableUrl.title }
              </button>
            )) }
          </div>
        </div>
        { sourcesMenuOpen ? closeVideoSourceMenuButton : null }
        { playerElement }
      </div>
  )
}
