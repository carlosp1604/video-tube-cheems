import { FC } from 'react'
import styles from './ModalBackHeader.module.scss'
import { BsArrowLeft } from 'react-icons/bs'
import { IconButton } from '~/components/IconButton/IconButton'

interface Props {
  title: string
  disabled: boolean
  onClick: () => void
}

export const ModalBackHeader: FC<Props> = ({ title, disabled, onClick }) => {
  return (
    <div className={ `
      ${styles.modalBackHeader__container}
      ${disabled ? styles.modalBackHeader__container_disabled : ''}
    ` }>
      <IconButton
        onClick={ onClick }
        icon={ <BsArrowLeft /> }
        title={ title }
      />
      { title }
    </div>
  )
}
