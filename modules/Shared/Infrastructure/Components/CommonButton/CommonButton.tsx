import { FC, ReactElement, Ref, useRef } from 'react'
import styles from './CommonButton.module.scss'
import { useClickAnimation } from '~/hooks/ClickAnimation/ClickAnimation'

type CommonButtonCallback = () => void

export interface Props {
  title: string
  disabled: boolean
  onClick: CommonButtonCallback
}

export interface OptionalProps {
  border: boolean
  icon: ReactElement
}

export const CommonButton: FC<Props & Partial<OptionalProps>> = ({
  title,
  disabled,
  onClick,
  border = false,
  icon = undefined,
}) => {
  const ref: Ref<HTMLButtonElement> = useRef(null)

  useClickAnimation(ref)

  return (
    <button
      className={ `
        ${styles.commonButton__container} ${border ? styles.commonButton__withBorder : ''}
      ` }
      ref={ ref }
      title={ title }
      disabled={ disabled }
      onClick={ onClick }
    >
      { icon }
      { title }
    </button>
  )
}
