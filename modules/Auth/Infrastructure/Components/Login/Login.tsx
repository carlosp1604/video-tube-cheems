import { signIn } from 'next-auth/react'
import { FC, FormEvent, useState } from 'react'
import styles from './Login.module.scss'
import { emailValidator, passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import useTranslation from 'next-translate/useTranslation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useToast } from '~/components/AppToast/ToastContext'

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
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { t } = useTranslation('user_login')
  const { error } = useToast()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (password === '' || email === '') {
      return
    }

    setLoading(true)

    const result = await signIn(
      'credentials',
      {
        redirect: false,
        password,
        email,
      })

    if (result?.error) {
      error(t('login_error_message'))
    } else {
      onSuccessLogin()
    }

    setLoading(false)
  }

  const canEnableSubmitButton = () => {
    return !invalidEmail &&
      !invalidPassword &&
      email !== '' &&
      password !== '' &&
      !loading
  }

  return (
    <form
      className={ `
        ${styles.login__container}
        ${loading ? styles.login__container_loading : ''}
      ` }
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

        <div className={ styles.login__passwordSection }>
          <FormInputSection
            label={ t('password_input_label') }
            errorLabel={ t('password_input_error_message') }
            type={ showPassword ? 'text' : 'password' }
            placeholder={ t('password_input_placeholder') }
            validator={ passwordValidator }
            onChange={ (value, invalidInput) => {
              setPassword(value)
              setInvalidPassword(invalidInput)
            } }
          />
          <span
            className={ styles.login__showHidePasswordButton }
            onClick={ (event) => {
              event.preventDefault()
              setShowPassword(!showPassword)
            } }
            title={ showPassword ? t('hide_password_button_title') : t('show_password_button_title') }
          >
            { showPassword
              ? <FaEyeSlash />
              : <FaEye /> }
           </span>
        </div>

      <SubmitButton
        title={ t('submit_button_title') }
        enableButton={ canEnableSubmitButton() }
        loading={ loading }
      />

      <div className={ styles.login__registerRecoverSection }>
        <button
          className={ styles.login__signupButton }
          onClick={ onClickSignup }
          disabled={ loading }
        >
          { t('sign_in_button_title') }
        </button>

        <button
          className={ styles.login__forgotPasswordButton }
          onClick={ onClickForgotPassword }
          disabled={ loading }
        >
          { t('forgot_password_button_title') }
        </button>
      </div>
    </form>
  )
}
