import {
  FC,
  ReactNode, useEffect,
  useState
} from 'react'
import { usePopper } from 'react-popper'
import cssStyles from './Tooltip.module.scss'
import { Placement, PositioningStrategy } from '@popperjs/core'

interface TooltipProps {
  tooltipId: string
  place: Placement
  content: string | ReactNode
}

interface OptionalTooltipProps {
  padding: number
  strategy: PositioningStrategy
}

export const Tooltip: FC<Required<TooltipProps> & Partial<OptionalTooltipProps>> = ({
  tooltipId,
  place,
  content,
  padding = 5,
  strategy = 'fixed',
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [referenceElement, setReferenceElement] = useState<Element | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: place,
    strategy,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, padding],
        },
      },
    ],
  })

  useEffect(() => {
    const element = document.querySelector(`[data-tooltip-id="${tooltipId}"]`)

    if (element) {
      setReferenceElement(element)

      const handlePointerOutside = async (event: PointerEvent) => {
        if (element && event.target && !element.contains(event.target as Node)) {
          setShowTooltip(false)
        }
      }

      element.addEventListener('touchstart', () => setShowTooltip(true))
      element.addEventListener('mouseover', () => setShowTooltip(true))
      document.addEventListener('pointerover', handlePointerOutside)

      return () => {
        document.removeEventListener('touchstart', () => setShowTooltip(true))
        document.removeEventListener('mouseover', () => setShowTooltip(true))
        document.removeEventListener('pointerover', handlePointerOutside)
      }
    }
  }, [tooltipId])

  if (!showTooltip) {
    return null
  }

  return (
    <div
      className={ cssStyles.tooltip__container }
      ref={ setPopperElement }
      style={ styles.popper }
      { ...attributes.popper }
    >
      { content }
    </div>
  )
}
