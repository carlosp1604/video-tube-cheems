import styles from './PostCardGalleryOptions.module.scss'
import { FC, ReactElement } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { BsTools } from 'react-icons/bs'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'

export interface PostCardGalleryOption {
  title: string
  icon: ReactElement
  onClick: (postCard: PostCardComponentDto) => void
}

interface Props {
  isOpen: boolean
  onClose: () => void
  options: PostCardGalleryOption[]
  selectedPostCard: PostCardComponentDto
}

export const PostCardGalleryOptions: FC<Props> = ({ isOpen, onClose, options, selectedPostCard }) => {
  const { t } = useTranslation('post_card_gallery')

  const buildOptions: MenuOptionComponentInterface[] = options.map((option) => {
    return {
      title: option.title,
      isActive: false,
      onClick: () => option.onClick(selectedPostCard),
      action: undefined,
      picture: option.icon,
    }
  })

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => onClose() }
    >
      <div className={ styles.postCardGalleryOptions__container }>
        <ModalMenuHeader
          title={ t('post_card_gallery_options_title') }
          subtitle={ t('post_card_gallery_options_description') }
          icon={ <BsTools /> }
        />
        <MenuOptions menuOptions={ buildOptions } />
      </div>
    </Modal>
  )
}
