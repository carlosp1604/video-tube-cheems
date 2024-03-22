import {FC, FormEvent, useState} from 'react'
import { Modal } from '~/components/Modal/Modal'
import { useLoginContext } from '~/hooks/LoginContext'
import { PiSealWarning } from 'react-icons/pi'
import styles from './Login.module.scss'
import {useTranslation} from "next-i18next";
import {signIn} from "next-auth/react";
import toast from "react-hot-toast";
import {FcGoogle} from "react-icons/fc";

export type AuthMode = 'login' | 'retrieve' | 'register'

export const LoginModal: FC = () => {
  const { loginModalOpen, setLoginModalOpen, mode, setMode } = useLoginContext()
  const { t } = useTranslation('user_login')

  const [loading, setLoading] = useState<boolean>(false)

  const onSuccessLogin = () => {
    setLoginModalOpen(false)
  }

  const onClick = async () => {
    setLoading(true)

    const result = await signIn(
      'google',
      {
        redirect: false,
      })

    if (result?.error) {
      toast.error(t('login_error_message'))
    } else {
      setLoading(false)
      // TODO: Add a welcome message?¿
    }

  }

  let onClose: (() => void) | null = () => setLoginModalOpen(false)

  return (
    <Modal
      isOpen={ loginModalOpen }
      onClose={ onClose }
    >
      <section className={ styles.login__loginWithProvidersContainer}>
        <h1 className={ styles.login__title }>
          { t('title') }
          <small className={ styles.login__subtitle }>
            { t('subtitle') }
          </small>
        </h1>
        <button
          className={ styles.login__googleButton }
          onClick={ onClick }
        >
          <FcGoogle className={ styles.login__googleIcon }/>
          { t('login_with_google') }
        </button>

        <span className={ styles.login__informationMessage }>
          { t('login_information_message') }
        </span>
      </section>
    </Modal>
  )
}
