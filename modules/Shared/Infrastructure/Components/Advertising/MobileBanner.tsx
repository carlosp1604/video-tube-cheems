import { FC } from 'react'
import styles from './Banner.module.scss'
import { ClickaduBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/ClickaduBanner/ClickaduBanner'

export const MobileBanner: FC = () => {
  if (!process.env.NEXT_PUBLIC_MOBILE_CLICKADU_BANNER_URL) {
    return null
  }

  return (
    <div className={ styles.banner__container }>
      <div className={ styles.banner__bannerContainer100x300 }>
        <ClickaduBanner />
      </div>
    </div>
  )
}
