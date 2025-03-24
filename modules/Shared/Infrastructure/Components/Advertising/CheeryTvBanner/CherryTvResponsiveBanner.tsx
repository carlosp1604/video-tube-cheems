import { FC, useEffect, useState } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'
import Image from 'next/image'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import {
  cherryTvBannerDesktopData,
  cherryTvBannerMobileData,
  postBannerDesktopData,
  postBannerMobileData
} from '~/adsData'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'

export const CherryTvResponsiveBanner: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [mobileBannerImage, setMobileBannerImage] = useState<string>('')
  const [desktopBannerImage, setDesktopBannerImage] = useState<string>('')

  const activeBreakPoint = useMediaQuery()

  const selectImages = () => {
    const mobileRandomNumber = Math.floor(Math.random() * postBannerMobileData.length)
    const desktopRandomNumber = Math.floor(Math.random() * postBannerDesktopData.length)

    setMobileBannerImage(cherryTvBannerMobileData[mobileRandomNumber])
    setDesktopBannerImage(cherryTvBannerDesktopData[desktopRandomNumber])
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
              'https://www.trackcherry.com/C497FC9/6W84K8/'
            ) }
          >
            <Image
              src={ desktopBannerImage }
              alt={ t('advertising_cherry_tv_banner_alt_title') }
              width={ 729 }
              height={ 90 }
              sizes={ '100vw' }
              placeholder={ 'blur' }
              blurDataURL={ rgbDataURL(81, 80, 80) }
              priority={ true }
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
              'https://www.trackcherry.com/C497FC9/6W84K8/'
            ) }
          >
            <Image
              src={ mobileBannerImage }
              alt={ t('advertising_cherry_tv_banner_alt_title') }
              width={ 300 }
              height={ 100 }
              sizes={ '100vw' }
              placeholder={ 'blur' }
              blurDataURL={ rgbDataURL(81, 80, 80) }
              priority={ true }
            />
            <RiAdvertisementLine className={ styles.banner__adIcon }/>
          </div>
        </div>
      )
    }
  }
}
