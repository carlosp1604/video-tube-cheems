import { FC, useEffect, useState } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'
import ClickAdu300x100Banner
  from '~/modules/Shared/Infrastructure/Components/Advertising/ClickAdu/ClickAdu300x100Banner'
import ClickAdu728x90Banner
  from '~/modules/Shared/Infrastructure/Components/Advertising/ClickAdu/ClickAdu728x90Banner'

export const ClickAduResponsiveBanner: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  const activeBreakPoint = useMediaQuery()

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
    if (activeBreakPoint >= MediaQueryBreakPoints.MD) {
      return (
        <div className={ styles.banner__container }>
          <ClickAdu728x90Banner />
        </div>
      )
    } else {
      return (
        <div className={ styles.banner__container }>
          <ClickAdu300x100Banner />
        </div>
      )
    }
  }
}
