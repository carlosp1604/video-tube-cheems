import styles from './DownloadMenu.module.scss'
import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { MediaUrlsHelper } from '~/modules/Posts/Infrastructure/Frontend/MediaUrlsHelper'
import { MdFileDownload } from 'react-icons/md'

interface Props {
  mediaUrls: MediaUrlComponentDto[]
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
  onClickOption: (mediaUrl: MediaUrlComponentDto) => void
}

export const DownloadMenu: FC<Props> = ({ mediaUrls, setIsOpen, isOpen, onClickOption }) => {
  const { t } = useTranslation('post')

  const menuOptions: MenuOptionComponentInterface[] = MediaUrlsHelper.sortMediaUrl(mediaUrls, true).map((mediaUrl) => {
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
          width={ 200 }
          height={ 200 }
          sizes={ '100vw' }
          fill={ false }
          priority={ true }
          placeholder={ 'blur' }
          blurDataURL={ rgbDataURL(81, 80, 80) }
        />
      ),
      isActive: false,
      onClick: () => onClickOption(mediaUrl),
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
          icon={ <MdFileDownload /> }
        />
        <div className={ styles.downloadMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ menuOptions } />
        </div>
      </div>
    </Modal>
  )
}
