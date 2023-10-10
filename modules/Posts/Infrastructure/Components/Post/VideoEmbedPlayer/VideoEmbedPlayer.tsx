import { createRef, FC, ReactElement, useEffect, useState } from 'react'
import { VideoEmbedUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'
import styles from './VideoEmbedPlayer.module.scss'
import Image from 'next/image'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineLoading } from 'react-icons/ai'

export interface Props {
  videoEmbedUrls: VideoEmbedUrlComponentDto[]
}

export const VideoEmbedPlayer: FC<Props> = ({ videoEmbedUrls }) => {
  const [selectedUrl, setSelectedUrl] = useState<VideoEmbedUrlComponentDto>(videoEmbedUrls[0])
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [showVideoOptions, setShowVideoOptions] = useState<boolean>(false)
  const iframeRef = createRef<HTMLIFrameElement>()

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = selectedUrl.url
    }
  }, [])

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
        <span className={ styles.videoEmbedPlayer__optionsContainerTitle }>
          Selecciona un reproductor
        </span>

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
                setVideoReady(false)
                setSelectedUrl(embedUrl)
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

      <button
        className={ `
          ${styles.videoEmbedPlayer__switcherButton}
          ${showVideoOptions ? styles.videoEmbedPlayer__switcherButton_visible : ''}
         ` }
        onClick={ () => setMenuOpen(!menuOpen) }
        title={ 'Some title' }
      >
        <BsThreeDotsVertical className={ styles.videoEmbedPlayer__optionIcon }
        />
      </button>
    </div>

  )
}
