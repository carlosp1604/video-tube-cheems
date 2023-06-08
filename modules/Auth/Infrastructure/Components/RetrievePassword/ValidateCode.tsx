import styles from './RetrievePassword.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { useTranslation } from 'next-i18next'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { FC, FormEvent, useState } from 'react'
import { verificationCodeValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'

export interface Props {
  email: string
  onConfirm: (token: string) => void
}

export const ValidateCode: FC<Props> = ({ email, onConfirm }) => {
  const [code, setCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)
  const [validationError, setValidationError] = useState<boolean>(false)

  const { t } = useTranslation('user_retrieve_password')

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    setValidationError(false)
    event.preventDefault()

    if (code === '') {
      return
    }

    try {
      const result = await authApiService.validateVerificationCode(email, code)

      if (!result.ok) {
        if (result.status === 404) {
          setErrorMessage(t('validate_code_invalid_code_message') ?? '')
          setValidationError(true)

          return
        }

        setErrorMessage(t('validate_code_server_error_message') ?? '')
        setValidationError(true)

        return
      }

      onConfirm(code)
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('validate_code_server_error_message') ?? '')
      setValidationError(true)
    }
  }

  const canSubmit = (): boolean => {
    return !invalidCode && code !== ''
  }

  return (
    <form
      className={ styles.retrievePassword__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.retrievePassword__title }>
        { t('validate_code_title') }
        <small className={ styles.retrievePassword__subtitle }>
          { t('validate_code_subtitle') }
        </small>
      </h1>

      <p className={ `
        ${styles.retrievePassword__error}
        ${validationError ? styles.retrievePassword__error_visible : ''}
      ` }>
        { errorMessage }
      </p>

      <FormInputSection
        label={ t('validate_code_code_input_label') }
        errorLabel={ t('validate_code_invalid_code_message') }
        type={ 'text' }
        placeholder={ t('validate_code_code_input_placeholder') }
        validator={ verificationCodeValidator }
        onChange={ (value, invalidInput) => {
          setCode(value)
          setInvalidCode(invalidInput)
        } }
      />

      <button
        type={ 'submit' }
        className={ `
          ${styles.retrievePassword__submit}
          ${canSubmit() ? styles.retrievePassword__submit__enabled : ''}
        ` }
        disabled={ !canSubmit() }
      >
        { t('validate_code_submit_button') }
      </button>
    </form>
  )
}
