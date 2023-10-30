import styles from './DownloadMenu.module.scss'
import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { BsDownload } from 'react-icons/bs'
import Image from 'next/image'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

interface Props {
  mediaUrls: MediaUrlComponentDto[]
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
}

export const DownloadMenu: FC<Props> = ({ mediaUrls, setIsOpen, isOpen }) => {
  const { t } = useTranslation('post')

  const menuOptions: MenuOptionComponentInterface[] = mediaUrls.map((mediaUrl) => {
    return {
      title: `${mediaUrl.provider.name}: ${mediaUrl.title}`,
      action: {
        url: mediaUrl.url,
        blank: true,
      },
      picture: (
        <Image
          alt={ t('post_download_option_alt_title', { providerName: mediaUrl.provider.name }) }
          className={ styles.downloadMenu__optionImage }
          src={ mediaUrl.provider.logoUrl }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      ),
      isActive: false,
      onClick: undefined,
    }
  })

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => setIsOpen(false) }
    >
      <div className={ styles.downloadMenu__container }>
        <div className={ styles.downloadMenu__titleSection }>
          <span className={ styles.downloadMenu__iconWrapper }>
            <BsDownload className={ styles.downloadMenu__icon }/>
          </span>
          <span className={ styles.downloadMenu__title }>
            { t('post_download_section_title') }
            <small className={ styles.downloadMenu__subtitle }>
              { t('post_download_section_description') }
            </small>
          </span>
        </div>
        <div className={ styles.downloadMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ menuOptions } />
        </div>
      </div>
    </Modal>
  )
}
