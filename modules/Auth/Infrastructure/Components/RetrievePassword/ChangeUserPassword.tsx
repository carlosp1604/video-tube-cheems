import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import styles from './RetrievePassword.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import useTranslation from 'next-translate/useTranslation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { useToast } from '~/components/AppToast/ToastContext'
import { ModalHeader } from '~/modules/Auth/Infrastructure/Components/ModalHeader/ModalHeader'
import { ModalError } from '~/modules/Auth/Infrastructure/Components/ModalError/ModalError'

export interface Props {
  email: string
  token: string
  onConfirm: () => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const ChangeUserPassword: FC<Props> = ({ email, token, onConfirm, loading, setLoading }) => {
  const [password, setPassword] = useState<string>('')
  const [passwordRepeat, setPasswordRepeat] = useState<string>('')
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
  const [invalidPasswordRepeat, setInvalidPasswordRepeat] = useState<boolean>(false)

  const authApiService = new AuthApiService()

  const { t } = useTranslation('user_retrieve_password')
  const { error } = useToast()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (token === '') {
      return
    }

    try {
      setLoading(true)

      const result = await authApiService.changeUserPassword(email, password, token)

      if (!result.ok) {
        switch (result.status) {
          case 404: {
            error(t('change_password_user_not_found_message', { email }))
            break
          }

          case 401: {
            error(t('change_password_user_not_found_message', { email }))
            break
          }

          case 422: {
            error(t('change_password_invalid_password_message'))
            break
          }

          default: {
            error(t('change_password_server_error_message'))
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
      error(t('change_password_server_error_message'))
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
    return !invalidPassword &&
      password !== '' &&
      !invalidPasswordRepeat &&
      passwordRepeat !== '' &&
      password === passwordRepeat &&
      !loading
  }

  return (
    <form
      className={ `
        ${styles.retrievePassword__container}
        ${loading ? styles.retrievePassword__container_loading : ''}
      ` }
      onSubmit={ onSubmit }
    >
      <ModalHeader
        title={ t('change_password_title') }
        subtitle={ t('change_password_subtitle', { email }) }
      />

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
        errorLabel={ t('change_password_password_error_message') }
        type={ 'password' }
        placeholder={ t('change_password_retype_password_input_placeholder') }
        validator={ passwordValidator }
        onChange={ (value, invalidInput) => {
          setPasswordRepeat(value)
          setInvalidPasswordRepeat(invalidInput)
        } }
      />

      <ModalError
        title={ t('change_password_retype_password_error_message') }
        visible={ showPasswordsDoesNotMatchErrorMessage() }
      />

      <SubmitButton
        title={ t('change_password_submit_button') }
        disabled={ !canSubmit() }
        loading={ loading }
      />
    </form>
  )
}
