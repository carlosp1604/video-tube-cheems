import { FC, ReactElement } from 'react'
import styles from './SubmitButton.module.scss'
import { AiOutlineLoading } from 'react-icons/ai'

export interface Props {
  title: string
  enableButton: boolean
  loading: boolean
  emphasize: boolean
}

export const SubmitButton: FC<Partial<Props> & Pick<Props, 'title' | 'enableButton'>> = ({
  title,
  enableButton,
  loading = false,
  emphasize = false,
}) => {
  let submitTitle: ReactElement | string = title

  if (loading) {
    submitTitle = (<AiOutlineLoading className={ styles.submitButton__loadingIcon }/>)
  }

  return (
    <button
      type={ 'submit' }
      className={ `
        ${styles.submitButton__container}
        ${enableButton ? styles.submitButton__container__enabled : ''}
        ${emphasize ? styles.submitButton__container__emphasize : ''}
      ` }
      disabled={ !enableButton }
    >
      { submitTitle }
    </button>
  )
}
