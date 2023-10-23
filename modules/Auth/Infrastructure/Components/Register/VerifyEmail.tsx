import { FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { emailValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import {
  USER_CANNOT_SEND_VERIFICATION_EMAIL,
  USER_EMAIL_ALREADY_REGISTERED, USER_INVALID_EMAIL, USER_INVALID_TOKEN_TYPE,
  USER_TOKEN_ALREADY_ISSUED
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import toast from 'react-hot-toast'

export interface Props {
  onConfirm: (email: string) => void
}

export const VerifyEmail: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation('user_signup')

  const [email, setEmail] = useState<string>('')
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [resendEmail, setResendEmail] = useState<boolean>(false)

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (email === '') {
      return
    }

    try {
      const result = await authApiService.verifyEmailForAccountCreation(email, resendEmail)

      if (!result.ok) {
        switch (result.status) {
          case 409: {
            const jsonResponse = await result.json()

            switch (jsonResponse.code) {
              case USER_TOKEN_ALREADY_ISSUED: {
                setResendEmail(true)
                toast.error(t('verify_email_email_already_sent_message'))
                break
              }

              case USER_EMAIL_ALREADY_REGISTERED: {
                toast.error(t('verify_email_email_not_available_message'))
                break
              }

              default: {
                toast.error(t('verify_email_server_error_message'))
                break
              }
            }
            break
          }

          case 422: {
            const jsonResponse = await result.json()

            switch (jsonResponse.code) {
              case USER_INVALID_EMAIL: {
                toast.error(t('verify_email_invalid_email_message') ?? '')
                break
              }

              case USER_CANNOT_SEND_VERIFICATION_EMAIL:
              case USER_INVALID_TOKEN_TYPE: {
                toast.error(t('verify_email_email_could_not_be_sent_message'))
                break
              }

              default: {
                toast.error(t('verify_email_server_error_message'))
                break
              }
            }

            break
          }
          default: {
            toast.error(t('verify_email_server_error_message'))
            break
          }
        }

        return
      }

      onConfirm(email)
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('verify_email_server_error_message'))
    }
  }

  const onClickHasVerificationCode = () => {
    if (email !== '' && !invalidEmail) {
      onConfirm(email)
    }
  }

  const canSubmit = (): boolean => {
    return !invalidEmail && email !== ''
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <div className={ styles.register__title }>
        { t('verify_email_title') }
        <small className={ styles.register__subtitle }>
          { t('verify_email_subtitle') }
        </small>
      </div>

      <FormInputSection
        label={ t('verify_email_email_input_label') }
        errorLabel={ t('verify_email_email_error_message') }
        type={ 'email' }
        placeholder={ t('verify_email_email_input_placeholder') }
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
          ${canSubmit() ? styles.register__submit__enabled : ''}
          ${resendEmail ? styles.register__submit_resendEmail : ''}
        ` }
        disabled={ !canSubmit() }
      >
        { resendEmail ? t('verify_email_resend_email') : t('verify_email_submit_button') }
      </button>
      <button className={ `
        ${styles.register__verificationCodeLink}
        ${canSubmit() ? styles.register__verificationCodeLink_active : ''}
      ` }
        onClick={ onClickHasVerificationCode }
        disabled={ !canSubmit() }
      >
        { t('verify_email_already_has_a_code_button_title') }
      </button>
    </form>
  )
}
