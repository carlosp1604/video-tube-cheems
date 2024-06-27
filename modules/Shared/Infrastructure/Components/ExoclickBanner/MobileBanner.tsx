import { FC } from 'react'
import styles from './MobileBanner.module.scss'
import { RiAdvertisementFill } from 'react-icons/ri'
import { ClickaduBanner } from '~/modules/Shared/Infrastructure/Components/ClickaduBanner/ClickaduBanner'

export const MobileBanner: FC = () => {
  if (!process.env.NEXT_PUBLIC_MOBILE_CLICKADU_BANNER_URL) {
    return null
  }

  return (
    <div className={ styles.mobileBanner__container }>
      <div className={ styles.mobileBanner__bannerWrapper }>
        <ClickaduBanner />
        <RiAdvertisementFill className={ styles.mobileBanner__bannerAd }/>
      </div>
    </div>
  )
}
