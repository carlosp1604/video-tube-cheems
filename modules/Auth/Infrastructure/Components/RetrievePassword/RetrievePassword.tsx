import { FC, ReactElement, useState } from 'react'
import { VerifyEmail } from './VerifyEmail'
import { ValidateToken } from './ValidateToken'
import styles from './RetrievePassword.module.scss'
import { BsArrowLeft } from 'react-icons/bs'
import { ConfirmingPasswordChanged } from './ConfirmingPasswordChanged'
import { ChangeUserPassword } from '~/components/RetrievePassword/ChangeUserPassword'

type RetrieveSteps = 'verifying_email' | 'validating_token' | 'validated_token' | 'password_changed'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export const RetrievePassword: FC<Props> = ({ onConfirm, onCancel }) => {
  const [email, setEmail] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [retrieveStep, setRetrieveStep] = useState<RetrieveSteps>('verifying_email')

  let onClickCancel = onCancel

  let content: ReactElement | string = ''

  if (retrieveStep === 'verifying_email') {
    content = (
      <VerifyEmail onConfirm={ (email: string) => {
        setEmail(email)
        setRetrieveStep('validating_token')
      } } />
    )
  }

  if (retrieveStep === 'validating_token') {
    onClickCancel = () => { setRetrieveStep('verifying_email') }
    content = (
      <ValidateToken email={ email } onConfirm={ (token: string) => {
        setToken(token)
        setRetrieveStep('validated_token')
      } }/>
    )
  }

  if (retrieveStep === 'validated_token') {
    content = (
      <ChangeUserPassword email={ email } token={ token } onConfirm={ () => {
        setRetrieveStep('password_changed')
      } }/>
    )
  }

  if (retrieveStep === 'password_changed') {
    content = (
      <ConfirmingPasswordChanged onConfirm={ () => {
        onConfirm()
      } }/>
    )
  }

  return (
    <div className={ styles.retrievePassword__registerForgotContainer }>
      <span className={ styles.retrievePassword__backSection }>
        <BsArrowLeft
          className={ styles.retrievePassword__backIcon }
          onClick={ () => onClickCancel() }
        />
        { 'Regresar' }
      </span>
      { content }
    </div>
  )
}
