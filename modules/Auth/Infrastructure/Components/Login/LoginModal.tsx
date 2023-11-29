import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { Login } from '~/modules/Auth/Infrastructure/Components/Login/Login'
import { Register } from '~/modules/Auth/Infrastructure/Components/Register/Register'
import { RetrievePassword } from '~/modules/Auth/Infrastructure/Components/RetrievePassword/RetrievePassword'
import { useLoginContext } from '~/hooks/LoginContext'

export type AuthMode = 'login' | 'retrieve' | 'register'

export const LoginModal: FC = () => {
  const { loginModalOpen, setLoginModalOpen, mode, setMode } = useLoginContext()

  let onClose: (() => void) | null = () => setLoginModalOpen(false)

  let modalContent = (
    <Login
      onClickForgotPassword={ () => setMode('retrieve') }
      onClickSignup={ () => setMode('register') }
      onSuccessLogin={ () => {
        setMode('login')
        setLoginModalOpen(false)
      } }
    />
  )

  if (mode === 'register') {
    modalContent = (
      <Register
        onConfirm={ () => setMode('login') }
        onCancel={ () => setMode('login') }
      />
    )

    onClose = () => setMode('login')
  }

  if (mode === 'retrieve') {
    modalContent = (
      <RetrievePassword
        onConfirm={ () => setMode('login') }
        onCancel={ () => setMode('login') }
      />
    )
  }

  return (
    <Modal
      isOpen={ loginModalOpen }
      onClose={ onClose }
    >
      { modalContent }
    </Modal>
  )
}
