import { FC, ReactElement, useEffect, useState } from 'react'
import styles from './IconButton.module.scss'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import * as uuid from 'uuid'

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
      title={ title }
      disabled={ disabled }
      data-tooltip-id={ tooltipId }
      data-tooltip-content={ title }
    >
      { icon }
      { showTooltip && mounted
        ? <Tooltip
          tooltipId={ tooltipId }
          place={ 'bottom' }
        />
        : null
      }

    </button>
  )
}
