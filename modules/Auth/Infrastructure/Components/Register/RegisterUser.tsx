import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
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
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState<boolean>(false)
  const [userCreationError, setUserCreationError] = useState<boolean>(false)

  const authApiService = new AuthApiService()

  const { t } = useTranslation('user-auth')

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

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setName('')
      setInvalidName(false)

      return
    }

    try {
      nameValidator.parse(event.target.value)
      setName(event.target.value)
      setInvalidName(false)
    } catch (exception: unknown) {
      setInvalidName(true)
      setName('')
    }
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setUsername('')
      setInvalidUsername(false)

      return
    }

    try {
      usernameValidator.parse(event.target.value)
      setUsername(event.target.value)
      setInvalidUsername(false)
    } catch (exception: unknown) {
      setInvalidUsername(true)
      setUsername('')
    }
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setPassword('')
      setInvalidPassword(false)

      return
    }

    try {
      passwordValidator.parse(event.target.value)
      setPassword(event.target.value)
      setInvalidPassword(false)
    } catch (exception: unknown) {
      setInvalidPassword(true)
      setPassword('')
    }
  }

  const handlePasswordRepeatChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setPasswordRepeat('')
      setInvalidPassword(false)

      return
    }

    if (password === event.target.value) {
      setPasswordRepeat(event.target.value)
      setPasswordDoesNotMatch(false)
    } else {
      setPasswordDoesNotMatch(true)
      setPasswordRepeat('')
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

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          { t('user_signup_signup_name_input_label') }
        </label>
        <input
          type={ 'text' }
          className={ `
            ${styles.register__input}
            ${invalidName ? styles.register__input__error : ''}
          ` }
          placeholder={ t('user_signup_signup_name_input_placeholder') ?? '' }
          onChange={ handleNameChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidName ? styles.register__inputErrorMessage__open : ''}
        ` }>
          { t('user_signup_signup_name_error_message') }
        </label>
      </div>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          { t('user_signup_signup_username_input_label') }
        </label>
        <input
          type={ 'text' }
          className={ `
            ${styles.register__input}
            ${invalidUsername ? styles.register__input__error : ''}
          ` }
          placeholder={ t('user_signup_signup_username_input_placeholder') ?? '' }
          onChange={ handleUsernameChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidUsername ? styles.register__inputErrorMessage__open : ''}
        ` }>
          { t('user_signup_signup_username_error_message') }
        </label>
      </div>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          { t('user_signup_signup_password_input_label') }
        </label>
        <input
          type={ 'password' }
          className={ `
            ${styles.register__input}
            ${invalidPassword ? styles.register__input__error : ''}
          ` }
          placeholder={ t('user_signup_signup_password_input_placeholder') ?? '' }
          onChange={ handlePasswordChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidPassword ? styles.register__inputErrorMessage__open : ''}
        ` }>
          { t('user_signup_signup_password_error_message') }
        </label>
      </div>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          { t('user_signup_signup_retype_password_input_label') }
        </label>
        <input
          type={ 'password' }
          className={ `
            ${styles.register__input}
            ${passwordDoesNotMatch ? styles.register__input__error : ''}
          ` }
          placeholder={ t('user_signup_signup_retype_password_input_placeholder') ?? '' }
          onChange={ handlePasswordRepeatChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${passwordDoesNotMatch ? styles.register__inputErrorMessage__open : ''}
        ` }>
          { t('user_signup_signup_retype_password_error_message') }
        </label>
      </div>

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
