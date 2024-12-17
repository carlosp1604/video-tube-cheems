import { RefObject, useEffect } from 'react'

export const useClickOutside = (ref: RefObject<Element>, callback: () => void) => {
  useEffect(() => {
    function handlePointerOutside (event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        callback()
      }
    }
    document.addEventListener('click', handlePointerOutside)

    return () => {
      document.removeEventListener('click', handlePointerOutside)
    }
  }, [ref, callback])
}
