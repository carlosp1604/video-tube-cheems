import { FC, ReactElement, useState } from 'react'
import { VerifyEmail } from '~/components/Register/VerifyEmail'
import { ValidateToken } from '~/components/Register/ValidateToken'
import { RegisterUser } from '~/components/Register/RegisterUser'
import styles from './Register.module.scss'
import { BsArrowLeft } from 'react-icons/bs'
import { ConfirmingRegister } from '~/components/Register/ConfirmingRegister'

type RegistrationSteps = 'verifying_email' | 'validating_token' | 'validated_token' | 'signup_completed'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export const Register: FC<Props> = ({ onConfirm, onCancel }) => {
  const [email, setEmail] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [registrationStep, setRegistrationStep] = useState<RegistrationSteps>('verifying_email')

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
      <ValidateToken email={ email } onConfirm={ (token: string) => {
        setToken(token)
        setRegistrationStep('validated_token')
      } }/>
    )
  }

  if (registrationStep === 'validated_token') {
    content = (
      <RegisterUser email={ email } token={ token } onConfirm={ () => {
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
        />
        { 'Regresar' }
      </span>
      { content }
    </div>
  )
}
