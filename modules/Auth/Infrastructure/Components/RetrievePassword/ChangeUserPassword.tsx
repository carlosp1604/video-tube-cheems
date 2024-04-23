import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import styles from './RetrievePassword.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import useTranslation from 'next-translate/useTranslation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { passwordValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import toast from 'react-hot-toast'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'

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
            toast.error(t('change_password_user_not_found_message', { email }))
            break
          }

          case 401: {
            toast.error(t('change_password_user_not_found_message', { email }))
            break
          }

          case 422: {
            toast.error(t('change_password_invalid_password_message'))
            break
          }

          default: {
            toast.error(t('change_password_server_error_message'))
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
      toast.error(t('change_password_server_error_message'))
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
      <h1 className={ styles.retrievePassword__title }>
        { t('change_password_title') }
        <small className={ styles.retrievePassword__subtitle }>
          { t('change_password_subtitle', { email }) }
        </small>
      </h1>

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

      <p className={ `
        ${styles.retrievePassword__error}
        ${showPasswordsDoesNotMatchErrorMessage() ? styles.retrievePassword__error_visible : ''}
      ` }>
        { t('change_password_retype_password_error_message') }
      </p>

      <SubmitButton
        title={ t('change_password_submit_button') }
        enableButton={ canSubmit() }
        loading={ loading }
      />
    </form>
  )
}
