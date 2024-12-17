import { FC, useEffect, useState } from 'react'
import styles from './Toast.module.scss'
import { BsCheck, BsX } from 'react-icons/bs'
import { Toast as ToastInterface } from '~/components/AppToast/Toast'

export type AppToastProps = Omit<ToastInterface, 'id'>

export const Toast: FC<AppToastProps> = ({ type, duration, content, dismissible, onRemove }) => {
  const [hovered, setHovered] = useState(false)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  useEffect(() => {
    if (dismissible) {
      return
    }

    if (!timeoutId && !hovered) {
      const timeoutId = window.setTimeout(onRemove, duration)

      setTimeoutId(timeoutId)
    }

    if (timeoutId && hovered) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    if (timeoutId) {
      return () => clearTimeout(timeoutId)
    }
  }, [dismissible, timeoutId, hovered, duration, onRemove])

  return (
    <div
      className={ `${styles.toast__container} ${type === 'error' ? styles.toast__container_error : ''}` }
      onMouseOver={ () => setHovered(true) }
      onMouseLeave={ () => setHovered(false) }
    >
      { type === 'success'
        ? <BsCheck className={ `${styles.toast__icon} ${styles.toast__icon_succes}` }/>
        : <BsX className={ `${styles.toast__icon} ${styles.toast__icon_error}` }/>
      }

      <div className={ styles.toast__content }>
        { content }
      </div>
      { dismissible
        ? <button
            className={ styles.toast__closeButton }
            onClick={ () => onRemove() }
          >
            <BsX className={ styles.toast__closeIcon }/>
          </button>
        : null
      }
    </div>
  )
}
