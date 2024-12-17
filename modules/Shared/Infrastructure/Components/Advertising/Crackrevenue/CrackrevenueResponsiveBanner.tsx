import { FC } from 'react'
import { Banner } from 'exoclick-react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'

export const CrackrevenueResponsiveBanner: FC = () => {
  // TODO: Read env vars or load images

  return (
    <div className={ styles.banner__container }>
      <div className={ `${styles.banner__bannerWrapper90x729} ${styles.banner__responsiveDesktop}` }>
        <Banner zoneId={ 5494180 }/>
      </div>
      <div className={ `${styles.banner__bannerContainer100x300} ${styles.banner__responsiveMobile}` }>
        <Banner zoneId={ 4876984 }/>
        <RiAdvertisementLine className={ styles.banner__adIcon }/>
      </div>
    </div>
  )
}
