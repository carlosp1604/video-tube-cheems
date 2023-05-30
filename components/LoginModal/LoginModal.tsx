import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { Login } from '~/components/Login/Login'
import { Register } from '~/modules/Auth/Infrastructure/Components/Register/Register'
import { RetrievePassword } from '~/components/RetrievePassword/RetrievePassword'

export interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const LoginModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [openRegisterModal, setOpenRegisterModal] = useState<boolean>(false)
  const [openRetrievePasswordModal, setOpenRetrievePasswordModal] = useState<boolean>(false)

  let onClose: (() => void) | null = () => setIsOpen(false)

  let modalContent = (
    <Login modal={ {
      setOpenModal: setIsOpen,
      setOpenRegisterModal,
      setOpenRetrievePasswordModal,
    } }/>
  )

  if (openRegisterModal) {
    modalContent = (
      <Register
        onConfirm={ () => setOpenRegisterModal(false) }
        onCancel={ () => setOpenRegisterModal(false) }
      />
    )

    onClose = () => setOpenRegisterModal(false)
  }

  if (openRetrievePasswordModal) {
    modalContent = (
      <RetrievePassword
        onConfirm={ () => setOpenRetrievePasswordModal(false) }
        onCancel={ () => setOpenRetrievePasswordModal(false) }
      />
    )
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
    >
      { modalContent }
    </Modal>
  )
}
