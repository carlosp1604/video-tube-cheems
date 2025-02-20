import { FC } from 'react'
import styles from './Register.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { ModalHeader } from '~/modules/Auth/Infrastructure/Components/ModalHeader/ModalHeader'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { PiCheckCircleFill } from 'react-icons/pi'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingRegister: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_signup')

  return (
    <div className={ styles.register__confirmingRegister }>
      <PiCheckCircleFill className={ styles.register__confirmingRegisterIcon }/>
      <ModalHeader
        title={ t('confirming_signup_title') }
        subtitle={ t('confirming_signup_subtitle') }
      />
      <CommonButton
        title={ t('confirming_signup_button_title') }
        disabled={ false }
        onClick={ onConfirm }
      />
    </div>
  )
}
