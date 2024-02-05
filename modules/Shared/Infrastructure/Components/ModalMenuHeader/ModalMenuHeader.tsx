import styles from './ModalMenuHeader.module.scss'
import { FC, ReactElement } from 'react'

interface Props {
  title: string
  subtitle: string
  icon: ReactElement
}

export const ModalMenuHeader: FC<Props> = ({ title, subtitle, icon }) => {
  return (
    <div className={ styles.modalMenuHeader__container }>
      <span className={ styles.modalMenuHeader__iconWrapper }>
        { icon }
      </span>
      <span className={ styles.modalMenuHeader__title }>
        { title }
        <small className={ styles.modalMenuHeader__subtitle }>
          { subtitle }
        </small>
      </span>
    </div>
  )
}
