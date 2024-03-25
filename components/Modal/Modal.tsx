import React, { FC, ReactNode, useRef } from 'react'
import styles from './Modal.module.scss'
import { CSSTransition } from 'react-transition-group'
import { BsX } from 'react-icons/bs'

interface Callback {
  (): void
}

interface Props {
  isOpen: boolean
  onClose: Callback | undefined
  children: ReactNode
}

export const Modal: FC<Props> = ({
  isOpen,
  onClose = undefined,
  children,
}) => {
  const backdropRef = useRef(null)
  const slideOutRef = useRef(null)

  const closeButton = (
    <BsX
      className={ styles.modal__closeModalButton }
      onClick={ onClose }
    />
  )

  return (
    <CSSTransition
      classNames={ {
        enter: styles.modal__modalBackdropEnter,
        enterActive: styles.modal__modalBackdropEnterActive,
        enterDone: styles.modal__modalBackdropEnterDone,
        exit: styles.modal__modalBackdropExit,
        exitActive: styles.modal__modalBackdropExitActive,
        exitDone: styles.modal__modalBackdropExitDone,
      } }
      in={ isOpen }
      timeout={ parseInt('100') }
      ref={ backdropRef }
    >
      <div
        className={ styles.modal__modalBackdrop }
        onClick={ onClose }
      >
        <CSSTransition
          classNames={ {
            enter: styles.modal__containerEnter,
            enterActive: styles.modal__containerEnterActive,
            enterDone: styles.modal__containerEnterDone,
            exit: styles.modal__containerExit,
            exitActive: styles.modal__containerExitActive,
            exitDone: styles.modal__containerExitDone,
          } }
          ref={ slideOutRef }
          in={ isOpen }
          timeout={ parseInt('100') }
        >
          <section
            className={ styles.modal__container }
            onClick={ (event) => event.stopPropagation() }
          >
            { onClose && closeButton }
            { children }
          </section>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}
