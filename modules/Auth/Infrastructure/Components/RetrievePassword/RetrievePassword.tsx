import { FC, ReactElement, useState } from 'react'
import { VerifyEmail } from './VerifyEmail'
import { ValidateCode } from './ValidateCode'
import styles from './RetrievePassword.module.scss'
import { BsArrowLeft } from 'react-icons/bs'
import { ConfirmingPasswordChange } from './ConfirmingPasswordChange'
import { ChangeUserPassword } from '~/modules/Auth/Infrastructure/Components/RetrievePassword/ChangeUserPassword'
import { useTranslation } from 'next-i18next'

type RetrieveSteps = 'verifying_email' | 'validating_token' | 'validated_token' | 'password_changed'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export const RetrievePassword: FC<Props> = ({ onConfirm, onCancel }) => {
  const [email, setEmail] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [retrieveStep, setRetrieveStep] = useState<RetrieveSteps>('verifying_email')

  const { t } = useTranslation('user_password_retrieve')

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
      <ValidateCode email={ email } onConfirm={ (token: string) => {
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
      <ConfirmingPasswordChange onConfirm={ () => {
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
        { t('back_button_title') }
      </span>
      { content }
    </div>
  )
}
