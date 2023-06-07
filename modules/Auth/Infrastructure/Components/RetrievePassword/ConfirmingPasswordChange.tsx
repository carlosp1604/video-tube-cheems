import { FC } from 'react'
import styles from './RetrievePassword.module.scss'
import { useTranslation } from 'next-i18next'
import { BsCheckCircle } from 'react-icons/bs'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingPasswordChange: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_retrieve_password')

  return (
    <div className={ styles.retrievePassword__confirmingRegister }>
      <BsCheckCircle className={ styles.retrievePassword__confirmingRegisterIcon }/>
        <span className={ styles.retrievePassword__title }>
          { t('confirming_signup_title') }
          <small className={ styles.retrievePassword__subtitle } >
            { t('confirming_signup_subtitle') }
          </small>
        </span>
      <button
        className={ styles.retrievePassword__confirmingRegisterButton }
        onClick={ () => onConfirm() }
      >
        { t('confirming_signup_button_title') }
      </button>
    </div>
  )
}
