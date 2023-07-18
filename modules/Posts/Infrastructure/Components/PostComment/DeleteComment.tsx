import { Dispatch, FC, SetStateAction } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { CiUser } from 'react-icons/ci'

export interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const DeleteComment: FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => setIsOpen(false) }
    >
      <MenuOptions
        menuOptions={ [
          {
            // TODO: This should be extracted to an object when grow up
            translationKey: 'user_menu_profile_button',
            isActive: false,
            action: '/users/asdasd',
            icon: <CiUser />,
            onClick: () => setIsOpen(false),
          },
        ] } />
    </Modal>
  )
}
