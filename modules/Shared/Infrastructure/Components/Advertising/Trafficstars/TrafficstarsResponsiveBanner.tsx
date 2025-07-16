import { FC, useEffect, useState } from 'react'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'

export const TrafficstarsResponsiveBanner: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  const activeBreakpoint = useMediaQuery()

  useEffect(() => {
    if (mounted) {
      return
    }

    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!mounted) {
    return (
      <div className={ styles.banner__container }>
        <div className={ `${styles.banner__bannerWrapper90x729} ${styles.banner__responsiveDesktop}` } />
        <div className={ `${styles.banner__bannerContainer100x300} ${styles.banner__responsiveMobile}` } />
      </div>
    )
  } else {
    if (activeBreakpoint >= MediaQueryBreakPoints.MD) {
      return (
        <div className={ styles.banner__container }>
          <iframe
            width="728"
            height="90"
            className={ styles.banner__bannerWrapper90x729 }
            frameBorder="0"
            scrolling="no"
            src="//tsyndicate.com/iframes2/a2961976a5c048eeac73db8cdabe1094.html?"
          />
        </div>
      )
    } else {
      return (
        <div className={ styles.banner__container }>
          <iframe
            width="300"
            height="100"
            className={ styles.banner__bannerContainer100x300 }
            frameBorder="0"
            scrolling="no"
            src="//tsyndicate.com/iframes2/b5949d5aa5e74ee69e0e7f46d26fa08c.html?"
          />
        </div>
      )
    }
  }
}
