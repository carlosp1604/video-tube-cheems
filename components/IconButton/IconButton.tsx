import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import styles from './IconButton.module.scss'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import * as uuid from 'uuid'
import { useClickAnimation } from '~/hooks/ClickAnimation/ClickAnimation'

interface Props {
  onClick: (() => void) | undefined
  icon: ReactElement
  title: string
  disabled: boolean
  showTooltip: boolean
}

export const IconButton: FC<Partial<Props> & Pick<Props, 'onClick' | 'icon' | 'title'>> = ({
  onClick,
  icon,
  title,
  disabled = false,
  showTooltip = false,
}) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const buttonRef = useRef(null)

  useClickAnimation(buttonRef)

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())
  }, [])

  return (
    <button
      className={ styles.iconButton__button }
      onClick={ () => {
        if (onClick !== undefined && !disabled) {
          onClick()
        }
      } }
      ref={ buttonRef }
      title={ title }
      disabled={ disabled }
      data-tooltip-id={ tooltipId }
    >
      { icon }
      { showTooltip && mounted
        ? <Tooltip
          tooltipId={ tooltipId }
          place={ 'bottom' }
          content={ title }
        />
        : null
      }
    </button>
  )
}
