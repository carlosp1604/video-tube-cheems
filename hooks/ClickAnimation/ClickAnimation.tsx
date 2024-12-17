import { MutableRefObject, useEffect } from 'react'
import styles from './ClickAnimation.module.scss'

interface Config {
  color: {
    light: string
    dark: string
  }
}

export type UseClickAnimationConfig = Partial<Config>

export const useClickAnimation = (
  element: MutableRefObject<HTMLElement | null>,
  config: UseClickAnimationConfig = {}
) => {
  useEffect(() => {
    const applyContainerProperties = () => {
      if (element && element.current) {
        element.current.classList.add(styles.effectContainer)
      }
    }

    const applyStyles = (event: MouseEvent) => {
      const { offsetX, offsetY } = event
      const sizeOffset = 25

      if (element.current) {
        const { style } = element.current

        style.setProperty('--effect-top', `${offsetY - sizeOffset}px`)
        style.setProperty('--effect-left', `${offsetX - sizeOffset}px`)
        if (config.color) {
          style.setProperty('--effect-color', config.color.light)
          style.setProperty('--effect-color-dark', config.color.dark)
        }
      }
    }

    const onClick = (event: MouseEvent) => {
      if (element.current) {
        element.current.classList.remove(styles.effectContainerActive)
        applyStyles(event)
        element.current.classList.add(styles.effectContainerActive)
      }
    }

    // Apply the styles and classname to the element
    applyContainerProperties()

    // Add the event listener on mount
    if (element.current) {
      element.current.addEventListener('click', onClick)
    }

    // Needed for referencing the ref in the return function
    const cleanupRef = element.current

    return () => {
      if (cleanupRef) {
        cleanupRef.removeEventListener('click', onClick)
      }
    }
  }, [element, config])
}
