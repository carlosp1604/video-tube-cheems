import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { useLoginContext } from '~/hooks/LoginContext'
import { PiSealWarning } from 'react-icons/pi'
import styles from './Login.module.scss'
import {useTranslation} from "next-i18next";

export type AuthMode = 'login' | 'retrieve' | 'register'

export const LoginModal: FC = () => {
  const { loginModalOpen, setLoginModalOpen, mode, setMode } = useLoginContext()
  const { t } = useTranslation('user_login')

  let onClose: (() => void) | null = () => setLoginModalOpen(false)

  return (
    <Modal
      isOpen={ loginModalOpen }
      onClose={ onClose }
    >
      <section className={ styles.login__disabledFeatureContainer}>
        <PiSealWarning className={ styles.login__disabledFeatureIcon}/>
        <span className={ styles.login__disabledFeatureMessage}>
          { t('feature_disable_title')}
        </span>
      </section>
    </Modal>
  )
}
