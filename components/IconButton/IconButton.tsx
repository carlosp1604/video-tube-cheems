import { FC, ReactElement } from 'react'
import styles from './IconButton.module.scss'

interface Props {
  onClick: (() => void) | undefined
  icon: ReactElement
  title: string
}

export const IconButton: FC<Props> = ({ onClick, icon, title }) => {
  return (
    <button
      className={ styles.iconButton__button }
      onClick={ () => {
        if (onClick !== undefined) {
          onClick()
        }
      } }
      title={ title }
    >
      { icon }
    </button>
  )
}
