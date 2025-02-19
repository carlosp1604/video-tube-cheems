import styles from './ModalError.module.scss'
import { FC } from 'react'

export interface Props {
  title: string
  visible: boolean
}

export const ModalError: FC<Props> = ({ title, visible }) => {
  return (
    <p className={ `
      ${styles.modalError__container}
      ${visible ? styles.modalError__container_visible : ''}
    ` }>
      { title }
    </p>
  )
}
