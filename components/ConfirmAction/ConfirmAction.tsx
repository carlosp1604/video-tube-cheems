import { FC, ReactNode } from 'react'
import { Modal } from '~/components/Modal/Modal'
import styles from './ConfirmAction.module.scss'

interface Props {
  node: ReactNode
  title: string
  onClickConfirm: () => void
  onClickCancel: () => void
  isOpen: boolean
}

export const ConfirmAction: FC<Props> = ({ node, title, onClickConfirm, onClickCancel, isOpen }) => {
  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClickCancel }
    >
      { node }
      <div className={ styles.confirmAction__container }>
        { title }
        <div>
          <button>
            confirm
          </button>
          <button>
            cancel
          </button>
        </div>

      </div>
    </Modal>
  )
}
