import { signIn } from 'next-auth/react'
import { FC, FormEvent, useState } from 'react'
import styles from './Login.module.scss'
import { emailValidator, passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { useTranslation } from 'next-i18next'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import toast from 'react-hot-toast'

export interface Props {
  onClickSignup: () => void
  onClickForgotPassword: () => void
  onSuccessLogin: () => void
}

export const Login: FC<Props> = ({ onClickSignup, onClickForgotPassword, onSuccessLogin }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)

  const { t } = useTranslation('user_login')

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (password === '' || email === '') {
      return
    }

    const result = await signIn(
      'credentials',
      {
        redirect: false,
        password,
        email,
      })

    if (result?.error) {
      toast.error(t('sign_in_error_message'))
    } else {
      onSuccessLogin()
    }
  }

  const canEnableSubmitButton = () => {
    return !invalidEmail &&
      !invalidPassword &&
      email !== '' &&
      password !== ''
  }

  return (
    <form
      className={ styles.login__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.login__title }>
        { t('title') }
        <small className={ styles.login__subtitle }>
          { t('subtitle') }
        </small>
      </h1>

      <FormInputSection
        label={ t('email_input_label') }
        errorLabel={ t('email_input_error_message') }
        type={ 'email' }
        placeholder={ t('email_input_placeholder') }
        validator={ emailValidator }
        onChange={ (value, invalidInput) => {
          setEmail(value)
          setInvalidEmail(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('password_input_label') }
        errorLabel={ t('password_input_error_message') }
        type={ 'password' }
        placeholder={ t('password_input_placeholder') }
        validator={ passwordValidator }
        onChange={ (value, invalidInput) => {
          setPassword(value)
          setInvalidPassword(invalidInput)
        } }
      />

      <button
        type={ 'submit' }
        className={ `
          ${styles.login__submit}
          ${canEnableSubmitButton() ? styles.login__submit__enabled : ''}
        ` }
        disabled={ !canEnableSubmitButton() }
      >
        { t('submit_button_title') }
      </button>

      <div className={ styles.login__registerRecoverSection }>
        <button
          className={ styles.login__signupButton }
          onClick={ onClickSignup }
        >
          { t('sign_in_button_title') }
        </button>

        <button
          className={ styles.login__forgotPasswordButton }
          onClick={ onClickForgotPassword }
        >
          { t('forgot_password_button_title') }
        </button>
      </div>
    </form>
  )
}
