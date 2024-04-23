import { FC } from 'react'
import styles from './RetrievePassword.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { BsCheckCircle } from 'react-icons/bs'
import { useSession } from 'next-auth/react'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingPasswordChange: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_retrieve_password')

  const { status } = useSession()

  return (
    <div className={ styles.retrievePassword__confirmingRegister }>
      <BsCheckCircle className={ styles.retrievePassword__confirmingRegisterIcon }/>
        <span className={ styles.retrievePassword__title }>
          { t('confirming_retrieve_password_title') }
          <small className={ styles.retrievePassword__subtitle } >
            { status === 'unauthenticated'
              ? t('confirming_retrieve_password_subtitle')
              : t('confirming_retrieve_password_authenticated_user_subtitle')
            }
          </small>
        </span>
      <button
        className={ `
          ${styles.retrievePassword__confirmingRegisterButton}
          ${status === 'unauthenticated' ? styles.retrievePassword__confirmingRegisterButton_enabled : ''}
        ` }
        onClick={ () => onConfirm() }
        disabled={ status !== 'unauthenticated' }
      >
        { t('confirming_retrieve_password_button_title') }
      </button>
    </div>
  )
}
