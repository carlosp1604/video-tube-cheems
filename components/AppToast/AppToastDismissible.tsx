import { FC } from 'react'
import toast, { Toast } from 'react-hot-toast'
import { BsX } from 'react-icons/bs'
import styles from './AppToastDismissible.module.scss'

export interface Props {
  initialToast: Toast
  message: string
  onClose: () => void
}

export const AppToastDismissible: FC<Props> = ({ initialToast, message, onClose }) => {
  return (
    <>
      <span className={ styles.appToastDissmisible__messageContainer }>
      { message }
      </span>
      <button
        className={ styles.appToastDissmisible__dismissButton }
        onClick={ () => {
          toast.dismiss(initialToast.id)
          onClose()
        } }
      >
        <BsX className={ styles.appToastDissmisible__dismissIcon }/>
      </button>
    </>
  )
}
