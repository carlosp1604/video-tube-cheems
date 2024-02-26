import { FC } from 'react'
import { Banner } from 'exoclick-react'
import styles from './DesktopBanner.module.scss'
import { RiAdvertisementFill } from 'react-icons/ri'

export const DesktopBanner: FC = () => {
  if (!process.env.NEXT_PUBLIC_DESKTOP_EXOCLICK_BANNER_ID) {
    return null
  }

  return (
    <div className={ styles.desktopBanner__container }>
      <div className={ styles.desktopBanner__bannerWrapper }>
        <Banner zoneId={ process.env.NEXT_PUBLIC_DESKTOP_EXOCLICK_BANNER_ID } />
        <RiAdvertisementFill className={ styles.desktopBanner__bannerAd }/>
      </div>
    </div>
  )
}
