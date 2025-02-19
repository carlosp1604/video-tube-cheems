import { ChangeEvent, FC } from 'react'
import styles from './TextArea.module.scss'

interface AutoSizableTextAreaProps {
  placeHolder: string
  onCommentChange: (value: string) => void
  comment: string
  disabled: boolean
}

interface OptionalAutoSizableTextAreaProps {
  maxLength: number
}

export const TextArea: FC<AutoSizableTextAreaProps &Partial<OptionalAutoSizableTextAreaProps>> = ({
  placeHolder,
  onCommentChange,
  comment,
  disabled,
  maxLength = undefined,
}) => {
  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onCommentChange(event.target.value)
  }

  return (
    <textarea
      className={ styles.textArea__commentInput }
      placeholder={ placeHolder }
      onChange={ handleOnChange }
      value={ comment }
      disabled={ disabled }
      spellCheck={ false }
      { ...maxLength ? { maxLength } : {} }
    />
  )
}
