import React, { FC, ReactElement, useEffect, useState } from 'react'
import styles from './Modal.module.scss'
import { CSSTransition } from 'react-transition-group'

interface Callback {
  (): void
}

interface Props {
  isOpen: boolean
  onBackdropClick: Callback
  title: string | ReactElement | null
  message: string | ReactElement
}

export const Modal: FC<Props> = ({
  isOpen,
  onBackdropClick,
  title,
  message,
}) => {
  const [titleElement, setTitleElement] = useState<ReactElement | null>(null)

  useEffect(() => {
    if (title !== null) {
      setTitleElement((<h1 className={ styles.modal__messageTitle }>
        { title }
      </h1>))
    }
  }, [title])

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
    >
      <div
        className={ styles.modal__modalBackdrop }
        onClick={ () => onBackdropClick() }
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
          in={ isOpen }
          timeout={ parseInt('100') }
        >
          <section
            className={ styles.modal__container }
            onClick={(event) => event.stopPropagation()}
          >
            { titleElement }

            <div className={ styles.modal__messageText }>
              { message }
            </div>
          </section>
        </CSSTransition>
      </div>
      </CSSTransition>
  )
}
