import styles from './DownloadMenu.module.scss'
import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { VideoDownloadUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/VideoUrlComponentDto'
import { BsDownload } from 'react-icons/bs'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  downloadUrls: VideoDownloadUrlComponentDto[]
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
}

export const DownloadMenu: FC<Props> = ({ downloadUrls, setIsOpen, isOpen }) => {
  const { t } = useTranslation('post')

  if (downloadUrls.length === 0) {
    return null
  }

  if (downloadUrls.length === 1) {
    return (
      <Link href={ downloadUrls[0].url } target={ '_blank' }/>
    )
  }

  const menuOptions: MenuOptionComponentInterface[] = downloadUrls.map((downloadUrl) => {
    return {
      title: downloadUrl.name,
      action: {
        url: downloadUrl.url,
        blank: true,
      },
      picture: (
        <Image
          alt={ t('post_download_option_alt_title', { providerName: downloadUrl.name }) }
          className={ styles.downloadMenu__optionImage }
          src={ downloadUrl.logoUrl }
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
