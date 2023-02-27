import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Modal } from '../Modal/Modal'
import { Login } from '../Login/Login'
import { Register } from '../Register/Register'
import styles from './LoginModal.module.scss'
import { BsArrowLeft } from 'react-icons/bs'

export interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const LoginModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false)
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState<boolean>(false)

  return (
    <>
      <Modal 
        isOpen={isOpen}
        onBackdropClick={() => setIsOpen(false)}
        title={null}
        message={
          <Login modal={{ 
            setOpenModal: setIsOpen,
            setOpenRegisterModal: setRegisterModalOpen 
          }}/>
        }
      />
      <Modal 
        isOpen={registerModalOpen}
        onBackdropClick={() => {}}
        title={null}
        message={
          <div className={styles.loginModal__registerForgotContainer}>
            <span className={styles.loginModal__backSection}>
              <BsArrowLeft
                className={styles.loginModal__backIcon}
                onClick={() => setRegisterModalOpen(false)}
              />
              {'Regresar'}
            </span>
            <Register modal={{
              setOpenModal: setRegisterModalOpen 
            }}/>
          </div>
        }
      />
    </>
  )
}