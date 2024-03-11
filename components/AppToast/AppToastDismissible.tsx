import { FC } from 'react'
import toast, { Toast } from 'react-hot-toast'
import { BsX } from 'react-icons/bs'
import styles from './AppToastDismissible.module.scss'

export interface Props {
  initialToast: Toast
  message: string
}

export const AppToastDismissible: FC<Props> = ({ initialToast, message }) => {
  return (
    <>
      <span className={ styles.appToastDissmisible__messageContainer }>
      { message }
      </span>
      <button
        className={ styles.appToastDissmisible__dismissButton }
        onClick={ () => toast.dismiss(initialToast.id) }
      >
        <BsX className={ styles.appToastDissmisible__dismissIcon }/>
      </button>
    </>
  )
}
