import { useEffect, useState } from 'react'

export enum MediaQueryBreakPoints {
  DEFAULT_BREAKPOINT = 0,
  SM = 1,
  TB = 2,
  MD = 3,
  LG = 4,
  XL = 5,
  XXL = 6
}

export const useMediaQuery = () => {
  const [mediaQuery, setMediaQuery] = useState<MediaQueryBreakPoints>(MediaQueryBreakPoints.DEFAULT_BREAKPOINT)

  useEffect(() => {
    const handleResize = () => {
      function getActiveBreakpoint (): MediaQueryBreakPoints {
        if (window.matchMedia('(min-width: 1536px)').matches) {
          return MediaQueryBreakPoints.XXL
        } else if (window.matchMedia('(min-width: 1280px)').matches) {
          return MediaQueryBreakPoints.XL
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
          return MediaQueryBreakPoints.LG
        } else if (window.matchMedia('(min-width: 768px)').matches) {
          return MediaQueryBreakPoints.MD
        } else if (window.matchMedia('(min-width: 600px)').matches) {
          return MediaQueryBreakPoints.TB
        } else if (window.matchMedia('(min-width: 500px)').matches) {
          return MediaQueryBreakPoints.SM
        } else {
          return MediaQueryBreakPoints.DEFAULT_BREAKPOINT
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
