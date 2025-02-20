import { FC } from 'react'
import styles from './RetrievePassword.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { useSession } from 'next-auth/react'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { ModalHeader } from '~/modules/Auth/Infrastructure/Components/ModalHeader/ModalHeader'
import { PiCheckCircleFill } from 'react-icons/pi'

export interface Props {
  onConfirm: () => void
}

export const ConfirmingPasswordChange: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_retrieve_password')

  const { status } = useSession()

  return (
    <div className={ styles.retrievePassword__confirmingRegister }>
      <PiCheckCircleFill className={ styles.retrievePassword__confirmingRegisterIcon }/>
      <ModalHeader
        title={ t('confirming_retrieve_password_title') }
        subtitle={ status === 'unauthenticated'
          ? t('confirming_retrieve_password_subtitle')
          : t('confirming_retrieve_password_authenticated_user_subtitle')
        }
      />
      <CommonButton
        title={ t('confirming_retrieve_password_button_title') }
        disabled={ status !== 'unauthenticated' }
        onClick={ () => onConfirm() }
      />
    </div>
  )
}
