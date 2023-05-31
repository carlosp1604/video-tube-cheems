import { signIn } from 'next-auth/react'
import { FC, FormEvent, useState } from 'react'
import styles from './Login.module.scss'
import { emailValidator, passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { useTranslation } from 'next-i18next'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'

export interface Props {
  onClickSignup: () => void
  onClickForgotPassword: () => void
  onSuccessLogin: () => void
}

export const Login: FC<Props> = ({ onClickSignup, onClickForgotPassword, onSuccessLogin }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<boolean>(false)
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)

  const { t } = useTranslation('user_login')

  const onSubmit = async (event: FormEvent) => {
    setLoginError(false)
    event.preventDefault()

    if (password === '' || email === '') {
      return
    }

    const result = await signIn('credentials', { redirect: false, password, email })

    if (result?.error) {
      setLoginError(true)
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
        { t('user_login_title') }
        <small className={ styles.login__subtitle }>
          { t('user_login_subtitle') }
        </small>
      </h1>

      <p className={ `
        ${styles.login__error}
        ${loginError ? styles.login__error__open : ''}
      ` }>
        { t('user_login_sign_in_error_message') }
      </p>

      <FormInputSection
        label={ t('user_login_email_input_label') }
        errorLabel={ t('user_login_email_input_error_message') }
        type={ 'email' }
        placeholder={ t('user_login_email_input_placeholder') }
        validator={ emailValidator }
        onChange={ (value, invalidInput) => {
          setEmail(value)
          setInvalidEmail(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('user_login_password_input_label') }
        errorLabel={ t('user_login_password_input_error_message') }
        type={ 'password' }
        placeholder={ t('user_login_password_input_placeholder') }
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
        disabled={ invalidEmail || invalidPassword }
      >
        { t('user_login_submit_button_title') }
      </button>

      <div className={ styles.login__registerRecoverSection }>
        <button
          className={ styles.login__signupButton }
          onClick={ onClickSignup }
        >
          { t('user_login_sign_in_button_title') }
        </button>

        <button
          className={ styles.login__forgotPasswordButton }
          onClick={ onClickForgotPassword }
        >
          { t('user_login_forgot_password_button_title') }
        </button>
      </div>
    </form>
  )
}
