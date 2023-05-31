import { ChangeEvent, FC, HTMLInputTypeAttribute, useState } from 'react'
import styles from './FormInputSection.module.scss'
import { ZodString } from 'zod'

interface Props {
  label: string
  errorLabel: string
  type: HTMLInputTypeAttribute
  placeholder: string
  validator: ZodString
  extraValidation?: (value: string) => boolean
  onChange: (value: string, invalidInput: boolean) => void
}

export const FormInputSection: FC<Props> = ({
  label,
  errorLabel,
  type,
  placeholder,
  validator,
  extraValidation,
  onChange,
}) => {
  const [invalidInput, setInvalidInput] = useState<boolean>(false)
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setInvalidInput(false)
      onChange('', false)

      return
    }

    try {
      validator.parse(event.target.value)
      if (extraValidation) {
        if (!extraValidation(event.target.value)) {
          setInvalidInput(true)
          onChange('', true)

          return
        }
      }
      onChange(event.target.value, false)
      setInvalidInput(false)
    } catch (exception: unknown) {
      setInvalidInput(true)
      onChange('', true)
    }
  }

  return (
    <div className={ styles.formInputSection__container }>
      <label className={ styles.formInputSection__inputLabel }>
        { label }
      </label>
      <input
        type={ type }
        className={ `
          ${styles.formInputSection__input}
          ${invalidInput ? styles.formInputSection__input_error : ''}
        ` }
        placeholder={ placeholder }
        onChange={ handleOnChange }
      />
      <label className={ `
        ${styles.formInputSection__inputErrorMessage}
        ${invalidInput ? styles.formInputSection__inputErrorMessage_visible : ''}
      ` }>
        { errorLabel }
      </label>
    </div>
  )
}
