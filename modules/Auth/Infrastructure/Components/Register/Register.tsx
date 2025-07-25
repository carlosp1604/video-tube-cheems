import { FC, ReactElement, useState } from 'react'
import { VerifyEmail } from '~/modules/Auth/Infrastructure/Components/Register/VerifyEmail'
import { ValidateCode } from '~/modules/Auth/Infrastructure/Components/Register/ValidateCode'
import { RegisterUser } from '~/modules/Auth/Infrastructure/Components/Register/RegisterUser'
import styles from './Register.module.scss'
import { ConfirmingRegister } from '~/modules/Auth/Infrastructure/Components/Register/ConfirmingRegister'
import useTranslation from 'next-translate/useTranslation'
import { ModalBackHeader } from '~/modules/Auth/Infrastructure/Components/ModalBackHeader/ModalBackHeader'

type RegistrationSteps = 'verifying_email' | 'validating_token' | 'validated_token' | 'signup_completed'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export const Register: FC<Props> = ({ onConfirm, onCancel }) => {
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [registrationStep, setRegistrationStep] = useState<RegistrationSteps>('verifying_email')
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation('user_signup')

  let onClickCancel = onCancel

  let content: ReactElement | string = ''

  if (registrationStep === 'verifying_email') {
    content = (
      <VerifyEmail
        onConfirm={ (email: string) => {
          setEmail(email)
          setRegistrationStep('validating_token')
        } }
        loading={ loading }
        setLoading={ setLoading }
      />
    )
  }

  if (registrationStep === 'validating_token') {
    onClickCancel = () => { setRegistrationStep('verifying_email') }
    content = (
      <ValidateCode
        email={ email }
        onConfirm={ (token: string) => {
          setCode(token)
          setRegistrationStep('validated_token')
        } }
        loading={ loading }
        setLoading={ setLoading }
      />
    )
  }

  if (registrationStep === 'validated_token') {
    content = (
      <RegisterUser
        email={ email }
        code={ code } onConfirm={ () => {
          setRegistrationStep('signup_completed')
        } }
        loading = { loading }
        setLoading = { setLoading }
      />
    )
  }

  if (registrationStep === 'signup_completed') {
    content = (
      <ConfirmingRegister onConfirm={ () => {
        onConfirm()
      } }/>
    )
  }

  return (
    <div className={ styles.register__registerContainer }>
      <ModalBackHeader
        title={ t('back_button_title') }
        disabled={ false }
        onClick={ () => { if (!loading) { onClickCancel() } } }
      />
      { content }
    </div>
  )
}
