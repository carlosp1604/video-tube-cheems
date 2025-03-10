import { FC, useEffect, useState } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { RiAdvertisementLine } from 'react-icons/ri'
import Image from 'next/image'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'
import useTranslation from 'next-translate/useTranslation'
import { handleClick } from '~/modules/Shared/Infrastructure/FrontEnd/AntiAdBlockHelper'
import { cherryTV300x250Data } from '~/adsData'

export const CherryTv300x250Banner: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [image, setImage] = useState<string>('')

  const selectImage = () => {
    const randomIndex = Math.floor(Math.random() * cherryTV300x250Data.length)

    setImage(cherryTV300x250Data[randomIndex])
  }

  useEffect(() => {
    if (mounted) {
      return
    }

    selectImage()
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { t } = useTranslation('advertising')

  if (!mounted) {
    return (
      <div className={ styles.banner__container }>
        <div className={ `${styles.banner__bannerWrapper250x300}` } />
      </div>
    )
  }

  return (
    <div className={ styles.banner__container }>
      <div
        className={ `${styles.banner__bannerWrapper250x300}` }
        onClick={ () => handleClick(
          'https://www.trackcherry.com/C497FC9/6W84K8/'
        ) }
      >
        <Image
          src={ image }
          alt={ t('advertising_cherry_tv_banner_alt_title') }
          width={ 300 }
          height={ 250 }
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
