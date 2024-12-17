import { FC } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'
import Image from 'next/image'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import useTranslation from 'next-translate/useTranslation'

export const CrackrevenuePostPageBanner: FC = () => {
  const { t } = useTranslation('advertising')

  return (
    <div
      className={ styles.banner__container }
      onClick={ () => handleClick(
        'https://t.ajrkm2.com/258265/8780/32514?bo=2779,2778,2777,2776,2775&aff_sub5=SF_006OG000004lmDN'
      ) }
    >
      <div className={ `${styles.banner__bannerWrapper90x729} ${styles.banner__responsiveDesktop}` }>
        <Image
          src={ 'https://www.imglnkx.com/8780/009379D_JRKM_18_ALL_EN_125_L.gif' }
          alt={ t('advertising_jerkmate_banner_alt_title') }
          width={ 729 }
          height={ 90 }
          sizes={ '100vw' }
          placeholder={ 'blur' }
          blurDataURL={ rgbDataURL(81, 80, 80) }
        />
        <RiAdvertisementLine className={ styles.banner__adIcon }/>
      </div>
      <div className={ `${styles.banner__bannerContainer100x300} ${styles.banner__responsiveMobile}` }>
        <Image
          src={ 'https://www.imglnkx.com/8780/000110F_JRKM_18_ALL_EN_64_L.gif' }
          alt={ t('advertising_jerkmate_banner_alt_title') }
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
