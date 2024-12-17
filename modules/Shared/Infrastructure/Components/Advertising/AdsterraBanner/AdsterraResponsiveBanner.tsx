import { FC } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import {
  AdsterraDesktopBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraDesktopBanner'
import { AdsterraBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraBanner'

export const AdsterraResponsiveBanner: FC = () => {
  return (
    <>
      <div className={ styles.banner__responsiveDesktop }>
        <AdsterraDesktopBanner showAdLegend={ false } />
      </div>
      <div className={ styles.banner__responsiveMobile }>
        <AdsterraBanner showAdLegend={ false }/>
      </div>
    </>
  )
}
