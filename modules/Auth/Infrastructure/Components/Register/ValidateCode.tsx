import { ChangeEvent, FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { verificationCodeValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'

export interface Props {
  email: string
  onConfirm: (code: string) => void
}

export const ValidateCode: FC<Props> = ({ email, onConfirm }) => {
  const { t } = useTranslation('user-auth')

  const [code, setCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>(t('user_signup_validate_code_invalid_code_message') ?? '')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)
  const [validationError, setValidationError] = useState<boolean>(false)

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
        if (result.status === 409) {
          setErrorMessage(t('user_signup_validate_code_expired_code_message') ?? '')
          setValidationError(true)

          return
        }

        if (result.status === 404) {
          setErrorMessage(t('user_signup_validate_code_invalid_code_message') ?? '')
          setValidationError(true)

          return
        }

        setErrorMessage(t('user_signup_validate_code_server_error_message') ?? '')
        setValidationError(true)

        return
      }

      onConfirm(code)
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('user_signup_validate_code_server_error_message') ?? '')
      setValidationError(true)
    }
  }

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setCode('')
      setInvalidCode(false)

      return
    }

    try {
      verificationCodeValidator.parse(event.target.value)
      setCode(event.target.value)
      setInvalidCode(false)
    } catch (exception: unknown) {
      setInvalidCode(true)
      setCode('')
    }
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.register__title }>
        { t('user_signup_validate_code_title') }

        <small className={ styles.register__subtitle }>
          { t('user_signup_validate_code_subtitle') }
        </small>
      </h1>

      <p className={ `
        ${styles.register__error}
        ${validationError ? styles.register__error__open : ''}
      ` }>
        { errorMessage }
      </p>

      <div className={ styles.register__inputSection }>
        <label className={ styles.register__inputLabel }>
          { t('user_signup_validate_code_code_input_label') }
        </label>
        <input
          type={ 'text' }
          className={ `
            ${styles.register__input}
            ${invalidCode ? styles.register__input_error : ''}
          ` }
          placeholder={ t('user_signup_validate_code_code_input_placeholder') ?? '' }
          onChange={ handleCodeChange }
        />
        <label className={ `
          ${styles.register__inputErrorMessage}
          ${invalidCode ? styles.register__inputErrorMessage__open : ''}
        ` }>
          { t('user_signup_validate_code_invalid_code_message') }
        </label>
      </div>

      <button
        type={ 'submit' }
        className={ `
          ${styles.register__submit}
          ${!invalidCode && code !== '' ? styles.register__submit__enabled : ''}
        ` }
        disabled={ invalidCode }
      >
        { t('user_signup_validate_code_submit_button') }
      </button>
    </form>
  )
}
