import { FC, ReactElement } from 'react'
import styles from './IconButton.module.scss'

interface Props {
  onClick: (() => void) | undefined
  icon: ReactElement
}

export const IconButton: FC<Props> = ({ onClick, icon }) => {
  return (
    <button
      className={ styles.iconButton__button }
      onClick={ () => {
        if (onClick !== undefined) {
          onClick()
        }
      } }
    >
      { icon }
    </button>
  )
}
