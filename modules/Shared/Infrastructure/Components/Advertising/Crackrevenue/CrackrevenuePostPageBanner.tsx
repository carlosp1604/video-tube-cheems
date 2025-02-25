import { FC, useEffect, useState } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'
import Image from 'next/image'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { postBannerDesktopData, postBannerMobileData } from '~/adsData'

export const CrackrevenuePostPageBanner: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [mobileBannerImage, setMobileBannerImage] = useState<string>('')
  const [desktopBannerImage, setDesktopBannerImage] = useState<string>('')

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
  }

  return (
    <div className={ styles.banner__container }>
      <div
        className={ `${styles.banner__bannerWrapper90x729} ${styles.banner__responsiveDesktop}` }
        onClick={ () => handleClick(
          'https://t.ajump.link/258265/9022/0?aff_sub5=SF_006OG000004lmDN'
        ) }
      >
        <Image
          src={ desktopBannerImage }
          alt={ t('advertising_candy_ai_banner_alt_title') }
          width={ 729 }
          height={ 90 }
          sizes={ '100vw' }
          placeholder={ 'blur' }
          blurDataURL={ rgbDataURL(81, 80, 80) }
        />
        <RiAdvertisementLine className={ styles.banner__adIcon }/>
      </div>
      <div
        className={ `${styles.banner__bannerContainer100x300} ${styles.banner__responsiveMobile}` }
        onClick={ () => handleClick(
          'https://t.ajump.link/258265/9022/0?aff_sub5=SF_006OG000004lmDN'
        ) }
      >
        <Image
          src={ mobileBannerImage }
          alt={ t('advertising_candy_ai_banner_alt_title') }
          className={ styles.postCard__exocmedia }
          width={ 300 }
          height={ 100 }
          sizes={ '100vw' }
          placeholder={ 'blur' }
          blurDataURL={ rgbDataURL(81, 80, 80) }
        />
        <RiAdvertisementLine className={ styles.banner__adIcon }/>
      </div>
    </div>
  )
}
