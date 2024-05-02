import { FC } from 'react'
import styles from './CommonButton.module.scss'

type CommonButtonCallback = () => void

export interface Props {
  title: string
  disabled: boolean
  onClick: CommonButtonCallback
}

export const CommonButton: FC<Props> = ({ title, disabled, onClick }) => {
  return (
    <button
      className={ styles.commonButton__container }
      title={ title }
      disabled={ disabled }
      onClick={ onClick }
    >
      { title }
    </button>
  )
}
