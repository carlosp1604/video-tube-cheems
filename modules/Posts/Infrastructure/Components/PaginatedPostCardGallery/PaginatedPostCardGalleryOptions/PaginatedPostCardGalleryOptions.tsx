import styles from './PaginatedPostCardGalleryOptions.module.scss'
import { FC, ReactElement } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { BsTools } from 'react-icons/bs'

export interface PaginatedPostCardGalleryOption {
  title: string
  icon: ReactElement
  onClick: () => void
}

interface Props {
  isOpen: boolean
  onClose: () => void
  options: PaginatedPostCardGalleryOption[]
}

export const PaginatedPostCardGalleryOptions: FC<Props> = ({ isOpen, onClose, options }) => {
  const { t } = useTranslation('user_menu')

  const buildOptions: MenuOptionComponentInterface[] = options.map((option) => {
    return {
      title: option.title,
      isActive: false,
      onClick: option.onClick,
      action: undefined,
      picture: option.icon,
    }
  })

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => onClose() }
    >
      <div className={ styles.paginatedPostCardGalleryOptions__container }>
        <div className={ styles.paginatedPostCardGalleryOptions__titleSection }>
          <span className={ styles.paginatedPostCardGalleryOptions__iconWrapper }>
            <BsTools className={ styles.paginatedPostCardGalleryOptions__icon }/>
          </span>
          <span className={ styles.paginatedPostCardGalleryOptions__title }>
            { t('post_download_section_title') }
            <small className={ styles.paginatedPostCardGalleryOptions__subtitle }>
              { t('post_download_section_description') }
            </small>
          </span>
        </div>
        <MenuOptions menuOptions={ buildOptions } />
      </div>
    </Modal>
  )
}
