import styles from './Register.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import useTranslation from 'next-translate/useTranslation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import {
  nameValidator,
  passwordValidator,
  usernameValidator
} from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import {
  USER_EMAIL_ALREADY_REGISTERED,
  USER_INVALID_EMAIL,
  USER_INVALID_NAME,
  USER_INVALID_PASSWORD,
  USER_INVALID_USERNAME,
  USER_USERNAME_ALREADY_REGISTERED
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { useToast } from '~/components/AppToast/ToastContext'
import { ModalError } from '~/modules/Auth/Infrastructure/Components/ModalError/ModalError'
import { ModalHeader } from '~/modules/Auth/Infrastructure/Components/ModalHeader/ModalHeader'

export interface Props {
  email: string
  code: string
  onConfirm: () => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const RegisterUser: FC<Props> = ({
  email,
  code,
  onConfirm,
  loading,
  setLoading,
}) => {
  const [username, setUsername] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false)
  const [invalidName, setInvalidName] = useState<boolean>(false)
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [invalidPasswordRepeat, setInvalidPasswordRepeat] = useState<boolean>(false)

  const authApiService = new AuthApiService()

  const { t } = useTranslation('user_signup')
  const { error } = useToast()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (code === '') {
      return
    }

    try {
      setLoading(true)

      const result = await authApiService.createUser(
        name,
        email,
        password,
        username,
        // FIXME: Decide the user language
        'es',
        code
      )

      if (!result.ok) {
        switch (result.status) {
          case 401: {
            error(t('signup_invalid_code_message'))

            break
          }

          case 409: {
            const jsonResponse = await result.json()

            switch (jsonResponse.code) {
              case USER_EMAIL_ALREADY_REGISTERED:
                error(t('signup_email_already_registered_message'))
                break
              case USER_USERNAME_ALREADY_REGISTERED:
                error(t('signup_username_already_registered_message'))
                break

              default:
                error(t('signup_server_error_message'))
            }

            break
          }

          case 422: {
            const jsonResponse = await result.json()

            switch (jsonResponse.code) {
              case USER_INVALID_NAME:
                error(t('signup_invalid_name_message'))
                break

              case USER_INVALID_USERNAME:
                error(t('signup_invalid_username_message'))
                break

              case USER_INVALID_EMAIL:
                error(t('signup_invalid_email_message'))
                break

              case USER_INVALID_PASSWORD:
                error(t('signup_invalid_password_message'))
                break

              default:
                error(t('signup_server_error_message'))
                break
            }

            break
          }

          default: {
            error(t('signup_server_error_message'))

            break
          }
        }

        setLoading(false)

        return
      }

      onConfirm()
      setLoading(false)
    } catch (exception: unknown) {
      console.error(exception)
      error(t('signup_server_error_message'))
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
      password === passwordRepeat &&
      !loading
  }

  return (
    <form
      className={ `
        ${styles.register__container}
        ${loading ? styles.register__container_loading : ''}
      ` }
      onSubmit={ onSubmit }
    >
      <ModalHeader
        title={ t('signup_title') }
        subtitle={ t('signup_subtitle', { email }) }
      />

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

      <ModalError
        title={ t('signup_retype_password_error_message') }
        visible={ showPasswordsDoesNotMatchErrorMessage() }
      />

      <SubmitButton
        title={ t('signup_submit_button') }
        disabled={ !canSubmit() }
        loading={ loading }
      />
    </form>
  )
}
