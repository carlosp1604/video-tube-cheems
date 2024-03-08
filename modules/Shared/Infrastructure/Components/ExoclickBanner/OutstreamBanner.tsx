import { FC } from 'react'
import { Outstream } from 'exoclick-react'
import styles from './OutstreamBanner.module.scss'
import { RiAdvertisementFill } from 'react-icons/ri'
import { useTranslation } from 'next-i18next'

export const OutstreamBanner: FC = () => {
  const { t } = useTranslation('common')

  if (!process.env.NEXT_PUBLIC_OUTSTREAM_EXOCLICK_BANNER_ID) {
    return null
  }

  return (
    <div className={ styles.outstreamBanner__container }>
      <div className={ styles.outstreamBanner__bannerWrapper }>
        <Outstream zoneId={ process.env.NEXT_PUBLIC_OUTSTREAM_EXOCLICK_BANNER_ID } maxWidth={ 300 }/>
        <RiAdvertisementFill className={ styles.outstreamBanner__bannerAd }/>
      </div>
      { t('banner_ad_title') }
    </div>
  )
}
