import { FC } from 'react'
import styles from './ModalHeader.module.scss'

export interface Props {
  title: string
  subtitle: string
}

export const ModalHeader: FC<Props> = ({ title, subtitle }) => {
  return (
    <div className={ styles.modalHeader__container }>
      { title }
      <span className={ styles.modalHeader__subtitle }>
        { subtitle }
      </span>
    </div>

  )
}
