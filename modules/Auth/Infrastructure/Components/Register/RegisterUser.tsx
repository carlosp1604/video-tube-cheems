import styles from './Register.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { useTranslation } from 'next-i18next'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { FC, FormEvent, useState } from 'react'
import {
  nameValidator,
  passwordValidator,
  usernameValidator
} from '~/modules/Auth/Infrastructure/Frontend/DataValidation'

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
  const [invalidPasswordRepeat, setInvalidPasswordRepeat] = useState<boolean>(false)
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
        if (result.status === 409) {
          const jsonResponse = await result.json()

          setUserCreationError(true)

          if (jsonResponse.code === 'create-user-conflict-email-already-registered') {
            setErrorMessage(t('signup_email_already_registered_message') ?? '')
          } else {
            setErrorMessage(t('signup_username_already_registered_message') ?? '')
          }

          return
        }

        if (result.status === 422) {
          const jsonResponse = await result.json()

          setUserCreationError(true)

          switch (jsonResponse.code) {
            case 'create-user-unprocessable-entity-invalid-name':
              setErrorMessage(t('signup_invalid_name_message') ?? '')
              break
            case 'create-user-unprocessable-entity-invalid-username':
              setErrorMessage(t('signup_invalid_username_message') ?? '')
              break
            case 'create-user-unprocessable-entity-invalid-email':
              setErrorMessage(t('signup_invalid_email_message') ?? '')
              break
            case 'create-user-unprocessable-entity-invalid-password':
              setErrorMessage(t('signup_invalid_password_message') ?? '')
              break

            default:
              setErrorMessage(t('signup_server_error_message') ?? '')
              break
          }
          setUserCreationError(true)

          return
        }

        if (result.status === 401) {
          setErrorMessage(t('signup_invalid_code_message') ?? '')
          setUserCreationError(true)

          return
        }

        setErrorMessage(t('signup_server_error_message') ?? '')
        setUserCreationError(true)

        return
      }

      onConfirm()
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('signup_server_error_message') ?? '')
      setUserCreationError(true)
    }
  }

  const showPasswordsDoesNotMatchErrorMessage = (): boolean => {
    if (
      invalidPassword ||
      password === '' ||
      invalidPasswordRepeat ||
      passwordRepeat === ''
    ) {
      return false
    }

    return password !== passwordRepeat
  }

  const canSubmit = (): boolean => {
    return !invalidName && name !== '' &&
      !invalidUsername && username !== '' &&
      !invalidPassword && password !== '' &&
      !invalidPasswordRepeat && passwordRepeat !== '' &&
      password === passwordRepeat
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.register__title }>
        { t('signup_title') }
        <small className={ styles.register__subtitle }>
          { t('signup_subtitle', { email }) }
        </small>
      </h1>

      <p className={ `
        ${styles.register__error}
        ${userCreationError ? styles.register__error_visible : ''}
      ` }>
        { errorMessage }
      </p>

      <FormInputSection
        label={ t('signup_name_input_label') }
        errorLabel={ t('signup_name_error_message') }
        type={ 'text' }
        placeholder={ t('signup_name_input_placeholder') }
        validator={ nameValidator }
        onChange={ (value, invalidInput) => {
          setName(value)
          setInvalidName(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('signup_username_input_label') }
        errorLabel={ t('signup_username_error_message') }
        type={ 'text' }
        placeholder={ t('signup_username_input_placeholder') }
        validator={ usernameValidator }
        onChange={ (value, invalidInput) => {
          setUsername(value)
          setInvalidUsername(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('signup_password_input_label') }
        errorLabel={ t('signup_password_error_message') }
        type={ 'password' }
        placeholder={ t('signup_password_input_placeholder') }
        validator={ passwordValidator }
        onChange={ (value, invalidInput) => {
          setPassword(value)
          setInvalidPassword(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('signup_retype_password_input_label') }
        errorLabel={ t('signup_password_error_message') }
        type={ 'password' }
        placeholder={ t('signup_retype_password_input_placeholder') }
        validator={ passwordValidator }
        onChange={ (value, invalidInput) => {
          setPasswordRepeat(value)
          setInvalidPasswordRepeat(invalidInput)
        } }
      />

      <p className={ `
        ${styles.register__error}
        ${showPasswordsDoesNotMatchErrorMessage() ? styles.register__error_visible : ''}
      ` }>
        { t('signup_retype_password_error_message') }
      </p>

      <button
        type={ 'submit' }
        className={ `
          ${styles.register__submit}
          ${canSubmit() ? styles.register__submit__enabled : ''}
        ` }
        disabled={ !canSubmit() }
      >
        { t('signup_submit_button') }
      </button>
    </form>
  )
}
