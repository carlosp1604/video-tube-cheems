import { FC } from 'react'
import styles from './VideoSourcesMenu.module.scss'
import Image from 'next/image'
import { BsPlay } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export interface Props {
  mediaUrls: MediaUrlComponentDto[]
  selectedUrl: MediaUrlComponentDto | null
  onClickOption: (mediaUrl: MediaUrlComponentDto) => void
  menuOpen: boolean
  onClickMenu: () => void
}

export const VideoSourcesMenu: FC<Props> = ({ mediaUrls, selectedUrl, onClickOption, menuOpen, onClickMenu }) => {
  const { t } = useTranslation('post')

  return (
    <div className={ `
      ${styles.videoSourcesMenu__container}
      ${menuOpen ? styles.videoSourcesMenu__container__open : ''}
    ` }
      onClick={ () => onClickMenu() }
    >
      <div className={ styles.videoSourcesMenu__titleSection }>
        <span className={ styles.videoSourcesMenu__iconWrapper }>
          <BsPlay className={ styles.videoSourcesMenu__icon }/>
        </span>
        <span className={ styles.videoSourcesMenu__title }>
          { t('post_video_player_sources_menu_title') }
          <small className={ styles.videoSourcesMenu__subtitle }>
            { t('post_video_player_sources_menu_subtitle') }
          </small>
        </span>
      </div>

      <div className={ styles.videoSourcesMenu__optionsList }>
        { mediaUrls.map((mediaUrl) => {
          return (
            <button
              key={ mediaUrl.url }
              className={ `
              ${styles.videoSourcesMenu__optionItem}
              ${menuOpen ? styles.videoSourcesMenu__optionItem__open : ''}
              ${selectedUrl && selectedUrl.url === mediaUrl.url
                ? styles.optionvideoPostPlayer__optionItem__selected
                : ''}
            ` }
              onClick={ () => { onClickOption(mediaUrl) } }
            >
              <Image
                src={ mediaUrl.provider.logoUrl }
                alt={ mediaUrl.provider.name }
                className={ styles.videoSourcesMenu__optionLogo }
                width={ 0 }
                height={ 0 }
                sizes={ '100vw' }
              />
              <span>
                { mediaUrl.provider.name }
              </span>
            </button>
          )
        }) }
      </div>
    </div>
  )
}
