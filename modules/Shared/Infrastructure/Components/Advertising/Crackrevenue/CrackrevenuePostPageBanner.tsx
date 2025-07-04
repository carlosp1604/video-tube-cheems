import { FC, useEffect, useState } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { postBannerDesktopData, postBannerMobileData } from '~/adsData'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'

export const CrackrevenuePostPageBanner: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [mobileBannerImage, setMobileBannerImage] = useState<string>('')
  const [desktopBannerImage, setDesktopBannerImage] = useState<string>('')

  const activeBreakPoint = useMediaQuery()

  const selectImages = () => {
    const mobileRandomNumber = Math.floor(Math.random() * postBannerMobileData.length)
    const desktopRandomNumber = Math.floor(Math.random() * postBannerDesktopData.length)

    setMobileBannerImage(postBannerMobileData[mobileRandomNumber])
    setDesktopBannerImage(postBannerDesktopData[desktopRandomNumber])
  }

  useEffect(() => {
    if (mounted) {
      return
    }

    selectImages()
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { t } = useTranslation('advertising')

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
          <div
            className={ `${styles.banner__bannerWrapper90x729}` }
            onClick={ () => handleClick(
              'https://t.ajump.link/258265/9022/0?aff_sub5=SF_006OG000004lmDN'
            ) }
          >
            <video
              src={ desktopBannerImage }
              preload={ 'auto' }
              loop={ true }
              autoPlay={ true }
              controls={ false }
              muted={ true }
              title={ t('advertising_candy_ai_banner_alt_title') }
            />
            <RiAdvertisementLine className={ styles.banner__adIcon }/>
          </div>
        </div>

      )
    } else {
      return (
        <div className={ styles.banner__container }>
          <div
            className={ `${styles.banner__bannerContainer100x300}` }
            onClick={ () => handleClick(
              'https://t.ajump.link/258265/9022/0?aff_sub5=SF_006OG000004lmDN'
            ) }
          >
            <video
              src={ mobileBannerImage }
              preload={ 'auto' }
              loop={ true }
              autoPlay={ true }
              controls={ false }
              muted={ true }
              title={ t('advertising_candy_ai_banner_alt_title') }
            />
            <RiAdvertisementLine className={ styles.banner__adIcon }/>
          </div>
        </div>
      )
    }
  }
}
