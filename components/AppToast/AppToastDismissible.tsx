import toast from 'react-hot-toast'
import { BsX } from 'react-icons/bs'
import styles from './AppToastDismissible.module.scss'

export const createDismissibleToast = (
  message: string,
  onClose: (() => void) | undefined = undefined
) => {
  toast.success((t) => (
    <>
      <p className={ styles.appToastDissmisible__messageContainer }>
        { message }
      </p>
      <button
        className={ styles.appToastDissmisible__dismissButton }
        onClick={ () => {
          toast.dismiss(t.id)
          onClose && onClose()
        } }
      >
        <BsX className={ styles.appToastDissmisible__dismissIcon }/>
      </button>
    </>
  ), { id: 'app-menu-new-login-info-toast', duration: Infinity, icon: '' })
}
