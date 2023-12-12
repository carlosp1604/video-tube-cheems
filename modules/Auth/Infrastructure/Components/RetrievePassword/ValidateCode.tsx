import styles from './RetrievePassword.module.scss'
import { AuthApiService } from '~/modules/Auth/Infrastructure/Frontend/AuthApiService'
import { useTranslation } from 'next-i18next'
import { FormInputSection } from '~/components/FormInputSection/FormInputSection'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import { verificationCodeValidator } from '~/modules/Auth/Infrastructure/Frontend/DataValidation'
import toast from 'react-hot-toast'
import { SubmitButton } from '~/components/SubmitButton/SubmitButton'

export interface Props {
  email: string
  onConfirm: (token: string) => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const ValidateCode: FC<Props> = ({ email, onConfirm, loading, setLoading }) => {
  const [code, setCode] = useState<string>('')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)

  const { t } = useTranslation('user_retrieve_password')

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
            toast.error(t('validate_code_invalid_code_message'))
            break

          default:
            toast.error(t('validate_code_server_error_message'))
            break
        }

        setLoading(false)

        return
      }

      onConfirm(code)
      setLoading(false)
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('validate_code_server_error_message'))
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
        ${styles.retrievePassword__container}
        ${loading ? styles.retrievePassword__container_loading : ''}
      ` }
      onSubmit={ onSubmit }
    >
      <h1 className={ styles.retrievePassword__title }>
        { t('validate_code_title') }
        <small className={ styles.retrievePassword__subtitle }>
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

      <SubmitButton
        title={ t('validate_code_submit_button') }
        enableButton={ canSubmit() }
        loading={ loading }
      />
    </form>
  )
}
