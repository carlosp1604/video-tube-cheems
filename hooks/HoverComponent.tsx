import { RefObject, useEffect } from 'react'

export const useIsHovered = (ref: RefObject<Element>, callback: () => void) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    function handlePointerOutside (event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }
    // Bind the event listener
    document.addEventListener('pointerover', handlePointerOutside)
    // document.addEventListener('mouseover', handlePointerOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('pointerover', handlePointerOutside)
      // document.addEventListener('mouseover', handlePointerOutside)
    }
  }, [ref])
}
