import { FC, ReactElement } from 'react'
import styles from './IconButton.module.scss'

interface Props {
  onClick: (() => void) | undefined
  icon: ReactElement
  title: string
  disabled: boolean
}

export const IconButton: FC<Partial<Props> & Pick<Props, 'onClick' | 'icon' | 'title'>> = ({
  onClick,
  icon,
  title,
  disabled = false,
}) => {
  return (
    <button
      className={ styles.iconButton__button }
      onClick={ () => {
        if (onClick !== undefined && !disabled) {
          onClick()
        }
      } }
      title={ title }
      disabled={ disabled }
    >
      { icon }
    </button>
  )
}
