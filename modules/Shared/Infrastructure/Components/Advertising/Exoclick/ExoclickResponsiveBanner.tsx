import { FC } from 'react'
import { Banner } from 'exoclick-react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'

export const ExoclickResponsiveBanner: FC = () => {
  if (!process.env.NEXT_PUBLIC_MOBILE_EXOCLICK_BANNER_ID || !process.env.NEXT_PUBLIC_DESKTOP_EXOCLICK_BANNER_ID) {
    return null
  }

  return (
    <div className={ styles.banner__container }>
      <div className={ `${styles.banner__bannerWrapper90x729} ${styles.banner__responsiveDesktop}` }>
        <Banner zoneId={ process.env.NEXT_PUBLIC_DESKTOP_EXOCLICK_BANNER_ID }/>
        <RiAdvertisementLine className={ styles.banner__adIcon }/>
      </div>
      <div className={ `${styles.banner__bannerContainer100x300} ${styles.banner__responsiveMobile}` }>
        <Banner zoneId={ process.env.NEXT_PUBLIC_MOBILE_EXOCLICK_BANNER_ID }/>
        <RiAdvertisementLine className={ styles.banner__adIcon }/>
      </div>
    </div>
  )
}
