import styles from './DownloadMenu.module.scss'
import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { BsDownload } from 'react-icons/bs'
import Image from 'next/image'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'

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
        <ModalMenuHeader
          title={ t('post_download_section_title') }
          subtitle={ t('post_download_section_description') }
          icon={ <BsDownload /> }
        />
        <div className={ styles.downloadMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ menuOptions } />
        </div>
      </div>
    </Modal>
  )
}
