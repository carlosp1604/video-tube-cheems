import { FC, useEffect, useState } from 'react'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'

export const AdsterraResponsiveBanner: FC = () => {
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
        <div className={ `${styles.banner__bannerContainer50x320} ${styles.banner__responsiveMobile}` } />
      </div>
    )
  } else {
    if (activeBreakpoint >= MediaQueryBreakPoints.MD) {
      return (
        <div className={ styles.banner__container }>
          <div className={ `${styles.banner__bannerWrapper90x729} ${styles.banner__responsiveDesktop}` }/>
        </div>
      )
    } else {
      return (
        <div className={ styles.banner__container }>
          <div className={ `${styles.banner__bannerContainer50x320} ${styles.banner__responsiveMobile}` }/>
        </div>
      )
    }
  }
}
