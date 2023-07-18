import { FC, FormEvent, useState } from 'react'
import styles from './Register.module.scss'
import { useTranslation } from 'next-i18next'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { verificationCodeValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import toast from 'react-hot-toast'

export interface Props {
  email: string
  onConfirm: (code: string) => void
}

export const ValidateCode: FC<Props> = ({ email, onConfirm }) => {
  const [code, setCode] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)

  const { t } = useTranslation('user_signup')

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (code === '') {
      return
    }

    try {
      const result = await authApiService.validateVerificationCode(email, code)

      if (!result.ok) {
        switch (result.status) {
          case 401:
          case 404:
            toast.error(t('validate_code_invalid_code_message'))
            break

          default:
            toast.error(t('validate_code_server_error_message'))
            break
        }

        return
      }

      onConfirm(code)
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('validate_code_server_error_message'))
    }
  }

  const canSubmit = (): boolean => {
    return !invalidCode && code !== ''
  }

  return (
    <form
      className={ styles.register__container }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.register__title }>
        { t('validate_code_title') }
        <small className={ styles.register__subtitle }>
          { t('validate_code_subtitle') }
        </small>
      </h1>

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
          ${styles.register__submit}
          ${canSubmit() ? styles.register__submit__enabled : ''}
        ` }
        disabled={ !canSubmit() }
      >
        { t('validate_code_submit_button') }
      </button>
    </form>
  )
}
