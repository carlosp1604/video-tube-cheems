import { FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import {
  nameValidator,
  passwordValidator,
  usernameValidator
} from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'

export interface Props {
  email: string
  code: string
  onConfirm: () => void
}

export const RegisterUser: FC<Props> = ({ email, code, onConfirm }) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false)
  const [invalidName, setInvalidName] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState<boolean>(false)
  const [userCreationError, setUserCreationError] = useState<boolean>(false)

  const authApiService = new AuthApiService()

  const { t } = useTranslation('user_signup')

  const onSubmit = async (event: FormEvent) => {
    setUserCreationError(false)
    event.preventDefault()

    if (code === '') {
      return
    }

    try {
      const result = await authApiService.createUser(
        name,
        email,
        password,
        username,
        // FIXME: -----
        'es',
        code
      )

      if (!result.ok) {
        if (result.status === 409 || result.status === 400) {
          setErrorMessage(t('user_signup_signup_duplicated_user_message') ?? '')
          setUserCreationError(true)

          return
        }

        if (result.status === 422) {
          setErrorMessage(t('user_signup_signup_invalid_code_message') ?? '')
          setUserCreationError(true)

          return
        }

        setErrorMessage(t('user_signup_signup_server_error_message') ?? '')
        setUserCreationError(true)

        return
      }

      onConfirm()
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('user_signup_signup_server_error_message') ?? '')
      setUserCreationError(true)
    }
  }

  const canSubmit = (): boolean => {
    return !invalidName && name !== '' &&
      !invalidUsername && username !== '' &&
      !invalidPassword && password !== '' &&
      !passwordDoesNotMatch && passwordRepeat !== ''
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.register__title }>
        { t('user_signup_signup_title') }
        <small className={ styles.register__subtitle }>
          { t('user_signup_signup_subtitle', { email }) }
        </small>
      </h1>

      <p className={ `
        ${styles.register__error}
        ${userCreationError ? styles.register__error__open : ''}
      ` }>
        { errorMessage }
      </p>

      <FormInputSection
        label={ t('user_signup_signup_name_input_label') }
        errorLabel={ t('user_signup_signup_name_error_message') }
        type={ 'text' }
        placeholder={ t('user_signup_signup_name_input_placeholder') }
        validator={ nameValidator }
        onChange={ (value, invalidInput) => {
          setName(value)
          setInvalidName(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('user_signup_signup_username_input_label') }
        errorLabel={ t('user_signup_signup_username_error_message') }
        type={ 'text' }
        placeholder={ t('user_signup_signup_username_input_placeholder') }
        validator={ usernameValidator }
        onChange={ (value, invalidInput) => {
          setUsername(value)
          setInvalidUsername(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('user_signup_signup_password_input_label') }
        errorLabel={ t('user_signup_signup_password_error_message') }
        type={ 'password' }
        placeholder={ t('user_signup_signup_password_input_placeholder') }
        validator={ passwordValidator }
        onChange={ (value, invalidInput) => {
          setPassword(value)
          setInvalidPassword(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('user_signup_signup_retype_password_input_label') }
        errorLabel={ t('user_signup_signup_retype_password_error_message') }
        type={ 'password' }
        placeholder={ t('user_signup_signup_retype_password_input_placeholder') }
        validator={ passwordValidator }
        extraValidation={ (value: string) => {
          return value === password
        } }
        onChange={ (value, invalidInput) => {
          setPasswordRepeat(value)
          setPasswordDoesNotMatch(invalidInput)
        } }
      />

      <button
        type={ 'submit' }
        className={ `
          ${styles.register__submit}
          ${canSubmit() ? styles.register__submit__enabled : ''}
        ` }>
        { t('user_signup_signup_submit_button') }
      </button>
    </form>
  )
}
