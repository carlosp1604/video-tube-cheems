import { FC } from 'react'
import styles from './Register.module.scss'
import { BsCheckCircle } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingRegister: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user-signup')

  return (
    <div className={ styles.register__confirmingRegister }>
      <BsCheckCircle className={ styles.register__confirmingRegisterIcon }/>
        <span className={ styles.register__title }>
          { t('user_signup_confirming_signup_title') }
          <small className={ styles.register__subtitle } >
            { t('user_signup_confirming_signup_subtitle') }
          </small>
        </span>
      <button
        className={ styles.register__confirmingRegisterButton }
        onClick={ onConfirm }
      >
        { t('user_signup_confirming_signup_button_title') }
      </button>
    </div>
  )
}
