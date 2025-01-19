import { useEffect, useState } from 'react'

export const useMediaQuery = () => {
  const [mediaQuery, setMediaQuery] = useState<string>('default')

  useEffect(() => {
    const handleResize = () => {
      function getActiveBreakpoint () {
        if (window.matchMedia('(min-width: 1536px)').matches) {
          return '2xl'
        } else if (window.matchMedia('(min-width: 1280px)').matches) {
          return 'xl'
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
          return 'lg'
        } else if (window.matchMedia('(min-width: 768px)').matches) {
          return 'md'
        } else if (window.matchMedia('(min-width: 600px)').matches) {
          return 'tb'
        } else if (window.matchMedia('(min-width: 500px)').matches) {
          return 'sm'
        } else {
          return 'default'
        }
      }

      setMediaQuery(getActiveBreakpoint())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return mediaQuery
}
