import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import styles from './Register.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { emailValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import {
  USER_CANNOT_SEND_VERIFICATION_EMAIL,
  USER_EMAIL_ALREADY_REGISTERED, USER_INVALID_EMAIL, USER_INVALID_TOKEN_TYPE,
  USER_TOKEN_ALREADY_ISSUED
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { useRouter } from 'next/router'
import { useToast } from '~/components/AppToast/ToastContext'
import { ModalHeader } from '~/modules/Auth/Infrastructure/Components/ModalHeader/ModalHeader'

export interface Props {
  onConfirm: (email: string) => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const VerifyEmail: FC<Props> = ({ onConfirm, loading, setLoading }) => {
  const { t } = useTranslation('user_signup')

  const [email, setEmail] = useState<string>('')
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [resendEmail, setResendEmail] = useState<boolean>(false)
  const locale = useRouter().locale ?? 'en'
  const { error } = useToast()

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (email === '') {
      return
    }

    try {
      setLoading(true)

      const result = await authApiService.verifyEmailForAccountCreation(email, resendEmail, locale)

      if (!result.ok) {
        switch (result.status) {
          case 409: {
            const jsonResponse = await result.json()

            switch (jsonResponse.code) {
              case USER_TOKEN_ALREADY_ISSUED: {
                setResendEmail(true)
                error(t('verify_email_email_already_sent_message'))
                break
              }

              case USER_EMAIL_ALREADY_REGISTERED: {
                error(t('verify_email_email_not_available_message'))
                break
              }

              default: {
                error(t('verify_email_server_error_message'))
                break
              }
            }
            break
          }

          case 422: {
            const jsonResponse = await result.json()

            switch (jsonResponse.code) {
              case USER_INVALID_EMAIL: {
                error(t('verify_email_invalid_email_message') ?? '')
                break
              }

              case USER_CANNOT_SEND_VERIFICATION_EMAIL:
              case USER_INVALID_TOKEN_TYPE: {
                error(t('verify_email_email_could_not_be_sent_message'))
                break
              }

              default: {
                error(t('verify_email_server_error_message'))
                break
              }
            }

            break
          }
          default: {
            error(t('verify_email_server_error_message'))
            break
          }
        }

        setLoading(false)

        return
      }

      onConfirm(email)
      setLoading(false)
    } catch (exception: unknown) {
      console.error(exception)
      error(t('verify_email_server_error_message'))
    }
  }

  const onClickHasVerificationCode = () => {
    if (email !== '' && !invalidEmail) {
      onConfirm(email)
    }
  }

  const canSubmit = (): boolean => {
    return !invalidEmail &&
      email !== '' &&
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
        title={ t('verify_email_title') }
        subtitle={ t('verify_email_subtitle') }
      />

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

      <SubmitButton
        title={ resendEmail ? t('verify_email_resend_email') : t('verify_email_submit_button') }
        disabled={ !canSubmit() }
        loading={ loading }
      />

      <button className={ `
        ${styles.register__verificationCodeLink}
        ${canSubmit() ? styles.register__verificationCodeLink_active : ''}
      ` }
        onClick={ onClickHasVerificationCode }
        disabled={ !canSubmit() || loading }
      >
        { t('verify_email_already_has_a_code_button_title') }
      </button>
    </form>
  )
}
