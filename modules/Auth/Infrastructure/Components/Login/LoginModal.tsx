import { FC, ReactElement } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { Register } from '~/modules/Auth/Infrastructure/Components/Register/Register'
import { RetrievePassword } from '~/modules/Auth/Infrastructure/Components/RetrievePassword/RetrievePassword'
import { useLoginContext } from '~/hooks/LoginContext'
import { useSession } from 'next-auth/react'
import { Login } from '~/modules/Auth/Infrastructure/Components/Login/Login'

export type AuthMode = 'login' | 'retrieve' | 'register'

export const LoginModal: FC = () => {
  const { loginModalOpen, setLoginModalOpen, mode, setMode } = useLoginContext()

  const { status } = useSession()

  let onClose: (() => void) | null = () => setLoginModalOpen(false)

  let modalContent: ReactElement | null = null

  /** Login and register only allowed if user is not authenticated */
  if (
    (mode === 'login' || mode === 'register') &&
    status === 'authenticated'
  ) {
    setLoginModalOpen(false)
  }

  if (mode === 'login' && status === 'unauthenticated') {
    modalContent = (
      <Login
        onClickForgotPassword={ () => setMode('retrieve') }
        onClickSignup={ () => setMode('register') }
        onSuccessLogin={ () => {
          setMode('login')
          setLoginModalOpen(false)
        } }
      />
    )
  }

  if (mode === 'register' && status === 'unauthenticated') {
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
