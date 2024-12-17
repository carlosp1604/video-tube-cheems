import { FC } from 'react'
import { Outstream } from 'exoclick-react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import useTranslation from 'next-translate/useTranslation'

export const OutstreamBanner: FC = () => {
  const { t } = useTranslation('advertising')

  if (!process.env.NEXT_PUBLIC_OUTSTREAM_EXOCLICK_BANNER_ID) {
    return null
  }

  return (
    <div className={ styles.banner__container }>
      <div className={ styles.banner__bannerWrapper250x300 }>
        <Outstream zoneId={ process.env.NEXT_PUBLIC_OUTSTREAM_EXOCLICK_BANNER_ID } maxWidth={ 300 }/>
      </div>
      { t('advertising_banner_title') }
    </div>
  )
}
