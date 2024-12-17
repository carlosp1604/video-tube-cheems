import { FC, Ref } from 'react'
import { Toast as ToastInterface } from '~/components/AppToast/Toast'
import { Toast } from '~/components/AppToast/Toast/Toast'
import styles from './ToastsContainer.module.scss'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export interface ToastWithNodeRef {
  toast: ToastInterface
  nodeRef: Ref<HTMLDivElement>
}

export interface ToastsContainerProps {
  toasts: ToastWithNodeRef[]
}

const ToastsContainer: FC<ToastsContainerProps> = ({ toasts }) => {
  return (
    <TransitionGroup className={
      `${styles.toastsContainer__container} ${toasts.length ? styles.toastsContainer__container_visible : ''}`
    }>
      { toasts.map((toast) => (
        <CSSTransition
          classNames={ {
            enter: styles.toastsContainer__itemEnter,
            enterActive: styles.toastsContainer__itemEnterActive,
            enterDone: styles.toastsContainer__itemEnterDone,
            exit: styles.toastsContainer__itemExit,
            exitActive: styles.toastsContainer__itemExitActive,
            exitDone: styles.toastsContainer__itemExitDone,
          } }
          key={ toast.toast.id }
          timeout={ 500 }
          nodeRef={ toast.nodeRef }
        >
          <div
            className={ styles.toastsContainer__item }
            ref={ toast.nodeRef }
          >
            <Toast { ...toast.toast } />
          </div>
        </CSSTransition>
      )) }
    </TransitionGroup>
  )
}

export default ToastsContainer
