import { FC, Ref } from 'react'
import { Toast as ToastInterface } from '~/components/AppToast/Toast'
import styles from './ToastsContainer.module.scss'
import dynamic from 'next/dynamic'

const CSSTransition = dynamic(() =>
  import('react-transition-group').then((module) => module.CSSTransition), { ssr: false }
)

const TransitionGroup = dynamic(() =>
  import('react-transition-group').then((module) => module.TransitionGroup), { ssr: false }
)

const Toast = dynamic(() =>
  import('~/components/AppToast/Toast/Toast').then((module) => module.Toast), { ssr: false }
)

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
