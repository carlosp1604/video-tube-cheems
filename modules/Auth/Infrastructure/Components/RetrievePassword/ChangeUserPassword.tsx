import { FC, FormEvent, useState } from 'react'
import styles from './RetrievePassword.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { useTranslation } from 'next-i18next'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'

export interface Props {
  email: string
  token: string
  onConfirm: () => void
}

export const ChangeUserPassword: FC<Props> = ({ email, token, onConfirm }) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState<boolean>(false)
  const [passwordChangeError, setPasswordChangeError] = useState<boolean>(false)

  const authApiService = new AuthApiService()

  const { t } = useTranslation('user_retrieve_password')

  const onSubmit = async (event: FormEvent) => {
    setPasswordChangeError(false)
    event.preventDefault()

    if (token === '') {
      return
    }

    try {
      const result = await authApiService.changeUserPassword(email, password, token)

      if (!result.ok) {
        if (result.status === 404) {
          setErrorMessage(t('change_password_user_not_found_message', { email }) ?? '')
          setPasswordChangeError(true)

          return
        }

        if (result.status === 422) {
          setErrorMessage(t('change_password_invalid_code_message') ?? '')
          setPasswordChangeError(true)

          return
        }

        setErrorMessage(t('change_password_server_error_message') ?? '')
        setPasswordChangeError(true)

        return
      }

      onConfirm()
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('change_password_server_error_message') ?? '')
      setPasswordChangeError(true)
    }
  }

  const canSubmit = (): boolean => {
    return !invalidPassword &&
      password !== '' &&
      !passwordDoesNotMatch &&
      passwordRepeat !== ''
  }

  return (
    <form
      className={ styles.retrievePassword__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.retrievePassword__title }>
        { t('change_password_title') }
        <small className={ styles.retrievePassword__subtitle }>
          { t('change_password_subtitle', { email }) }
        </small>
      </h1>

      <p className={ `
        ${styles.retrievePassword__error}
        ${passwordChangeError ? styles.retrievePassword__error__open : ''}
      ` }>
        { errorMessage }
      </p>

      <FormInputSection
        label={ t('change_password_password_input_label') }
        errorLabel={ t('change_password_password_error_message') }
        type={ 'password' }
        placeholder={ t('change_password_password_input_placeholder') }
        validator={ passwordValidator }
        onChange={ (value, invalidInput) => {
          setPassword(value)
          setInvalidPassword(invalidInput)
        } }
      />

      <FormInputSection
        label={ t('change_password_retype_password_input_label') }
        errorLabel={ t('change_password_retype_password_error_message') }
        type={ 'password' }
        placeholder={ t('change_password_retype_password_input_placeholder') }
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
          ${styles.retrievePassword__submit}
          ${canSubmit() ? styles.retrievePassword__submit__enabled : ''}
        ` }>
        { t('change_password_submit_button') }
      </button>
    </form>
  )
}
