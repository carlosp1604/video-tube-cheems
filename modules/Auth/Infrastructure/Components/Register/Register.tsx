import { FC, ReactElement, useState } from 'react'
import { VerifyEmail } from '~/modules/Auth/Infrastructure/Components/Register/VerifyEmail'
import { ValidateCode } from '~/modules/Auth/Infrastructure/Components/Register/ValidateCode'
import { RegisterUser } from '~/modules/Auth/Infrastructure/Components/Register/RegisterUser'
import styles from './Register.module.scss'
import { BsArrowLeft } from 'react-icons/bs'
import { ConfirmingRegister } from '~/modules/Auth/Infrastructure/Components/Register/ConfirmingRegister'
import { useTranslation } from 'next-i18next'

type RegistrationSteps = 'verifying_email' | 'validating_token' | 'validated_token' | 'signup_completed'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export const Register: FC<Props> = ({ onConfirm, onCancel }) => {
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [registrationStep, setRegistrationStep] = useState<RegistrationSteps>('verifying_email')

  const { t } = useTranslation('user-auth')

  let onClickCancel = onCancel

  let content: ReactElement | string = ''

  if (registrationStep === 'verifying_email') {
    content = (
      <VerifyEmail onConfirm={ (email: string) => {
        setEmail(email)
        setRegistrationStep('validating_token')
      } } />
    )
  }

  if (registrationStep === 'validating_token') {
    onClickCancel = () => { setRegistrationStep('verifying_email') }
    content = (
      <ValidateCode email={ email } onConfirm={ (token: string) => {
        setCode(token)
        setRegistrationStep('validated_token')
      } }/>
    )
  }

  if (registrationStep === 'validated_token') {
    content = (
      <RegisterUser email={ email } code={ code } onConfirm={ () => {
        setRegistrationStep('signup_completed')
      } }/>
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
      <span className={ styles.register__backSection }>
        <BsArrowLeft
          className={ styles.register__backIcon }
          onClick={ () => onClickCancel() }
          title={ t('user_signup_back_button_title') ?? '' }
        />
        { t('user_signup_back_button_title') ?? '' }
      </span>
      { content }
    </div>
  )
}
