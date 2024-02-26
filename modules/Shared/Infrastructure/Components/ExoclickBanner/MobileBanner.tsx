import { FC } from 'react'
import { Banner } from 'exoclick-react'
import styles from './MobileBanner.module.scss'
import { RiAdvertisementFill } from 'react-icons/ri'

export const MobileBanner: FC = () => {
  if (!process.env.NEXT_PUBLIC_MOBILE_EXOCLICK_BANNER_ID) {
    return null
  }

  return (
    <div className={ styles.mobileBanner__container }>
      <div className={ styles.mobileBanner__bannerWrapper }>
        <Banner zoneId={ process.env.NEXT_PUBLIC_MOBILE_EXOCLICK_BANNER_ID } />
        <RiAdvertisementFill className={ styles.mobileBanner__bannerAd }/>
      </div>
    </div>
  )
}
