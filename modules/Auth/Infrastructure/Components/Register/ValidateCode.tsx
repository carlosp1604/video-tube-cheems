import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import styles from './Register.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { verificationCodeValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'
import { useToast } from '~/components/AppToast/ToastContext'
import { ModalHeader } from '~/modules/Auth/Infrastructure/Components/ModalHeader/ModalHeader'

export interface Props {
  email: string
  onConfirm: (code: string) => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const ValidateCode: FC<Props> = ({ email, onConfirm, loading, setLoading }) => {
  const [code, setCode] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)

  const { t } = useTranslation('user_signup')
  const { error } = useToast()

  const authApiService = new AuthApiService()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (code === '') {
      return
    }

    try {
      setLoading(true)

      const result = await authApiService.validateVerificationCode(email, code)

      if (!result.ok) {
        switch (result.status) {
          case 401:
          case 404:
            error(t('validate_code_invalid_code_message'))
            break

          default:
            error(t('validate_code_server_error_message'))
            break
        }

        setLoading(false)

        return
      }

      onConfirm(code)
      setLoading(false)
    } catch (exception: unknown) {
      console.error(exception)
      error(t('validate_code_server_error_message'))
    }
  }

  const canSubmit = (): boolean => {
    return !invalidCode &&
      code !== '' &&
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
        title={ t('validate_code_title') }
        subtitle={ t('validate_code_subtitle') }
      />

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

      <SubmitButton
        title={ t('validate_code_submit_button') }
        disabled={ !canSubmit() }
        loading={ loading }
      />
    </form>
  )
}
