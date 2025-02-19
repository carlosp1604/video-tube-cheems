import { FC, ReactElement } from 'react'
import styles from './SubmitButton.module.scss'
import { AiOutlineLoading } from 'react-icons/ai'

export interface Props {
  title: string
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export const SubmitButton: FC<Partial<Props> & Pick<Props, 'title' | 'disabled'>> = ({
  title,
  disabled,
  onClick = undefined,
  loading = false,
}) => {
  let submitTitle: ReactElement | string = title

  if (loading) {
    submitTitle = (<AiOutlineLoading className={ styles.submitButton__loadingIcon }/>)
  }

  return (
    <button
      type={ 'submit' }
      className={ styles.submitButton__container }
      disabled={ disabled }
      onClick={ () => onClick && onClick() }
    >
      { submitTitle }
    </button>
  )
}
