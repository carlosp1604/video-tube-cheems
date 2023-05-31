import { FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { emailValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'

export interface Props {
  onConfirm: (email: string) => void
}

export const VerifyEmail: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_signup')

  const [email, setEmail] = useState<string>('')
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [verificationError, setVerificationError] = useState<boolean>(false)
  const [resendEmail, setResendEmail] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] =
    useState<string>(t('user_signup_verify_email_email_not_available_message') ?? '')

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    setVerificationError(false)
    event.preventDefault()

    if (email === '') {
      return
    }

    try {
      const result = await authApiService.verifyEmailForAccountCreation(email, resendEmail)

      if (!result.ok) {
        if (result.status === 409) {
          const jsonResponse = await result.json()

          if (jsonResponse.code === 'verify-email-address-conflict-token-already-issued') {
            setResendEmail(true)
            setErrorMessage(t('user_signup_verify_email_email_already_sent_message') ?? '')
          } else {
            setErrorMessage(t('user_signup_verify_email_email_not_available_message') ?? '')
          }
          setVerificationError(true)

          return
        }

        if (result.status === 400) {
          setErrorMessage(t('user_signup_verify_email_email_error_message') ?? '')
          setVerificationError(true)

          return
        }

        if (result.status === 422) {
          setErrorMessage(t('user_signup_verify_email_email_could_not_be_sent_message') ?? '')
          setVerificationError(true)

          return
        }

        setErrorMessage(t('user_signup_verify_email_server_error_message') ?? '')
        setVerificationError(true)

        return
      }

      onConfirm(email)
    } catch (exception: unknown) {
      console.error(exception)
      setErrorMessage(t('user_signup_verify_email_server_error_message') ?? '')
      setVerificationError(true)
    }
  }

  const onClickHasVerificationCode = () => {
    if (email !== '' && !invalidEmail) {
      onConfirm(email)
    }
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <div className={ styles.register__title }>
        { t('user_signup_verify_email_title') }
        <small className={ styles.register__subtitle }>
          { t('user_signup_verify_email_subtitle') }
        </small>
      </div>

      <p className={ `
        ${styles.register__error}
        ${verificationError ? styles.register__error__open : ''}
      ` }>
        { errorMessage }
      </p>

      <FormInputSection
        label={ t('user_signup_verify_email_email_input_label') }
        errorLabel={ t('user_signup_verify_email_email_error_message') }
        type={ 'email' }
        placeholder={ t('user_signup_verify_email_email_input_placeholder') }
        validator={ emailValidator }
        onChange={ (value, invalidInput) => {
          setEmail(value)
          setInvalidEmail(invalidInput)
        } }
      />

      <button
        type={ 'submit' }
        className={ `
          ${styles.register__submit}
          ${!invalidEmail && email !== '' ? styles.register__submit__enabled : ''}
          ${resendEmail ? styles.register__submit_resendEmail : ''}
        ` }>
        { resendEmail ? t('user_signup_verify_email_resend_email') : t('user_signup_verify_email_submit_button') }
      </button>
      <button className={ `
        ${styles.register__verificationCodeLink}
        ${!invalidEmail && email !== '' ? styles.register__verificationCodeLink_active : ''}
      ` }
        onClick={ onClickHasVerificationCode }
        disabled={ invalidEmail }
      >
        { t('user_signup_verify_email_already_has_a_code_button_title') }
      </button>
    </form>
  )
}
