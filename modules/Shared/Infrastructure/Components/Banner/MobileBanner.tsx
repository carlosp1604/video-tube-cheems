import { createRef, FC, useEffect } from 'react'
import styles from './MobileBanner.module.scss'
import useTranslation from 'next-translate/useTranslation'

export const MobileBanner: FC = () => {
  const { t } = useTranslation('common')
  const bannerRef = createRef<HTMLDivElement>()

  const atOptions = {
    key: process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_BANNER_KEY ?? '',
    format: 'iframe',
    height: 50,
    width: 320,
    container: `atContainer-${process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_BANNER_KEY ?? ''}`,
    params: {},
  }

  useEffect(() => {
    if (atOptions.key === '') {
      return
    }

    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement('script')
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.src = `//${process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_BANNER_DOMAIN}/${atOptions.key}/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      bannerRef.current.append(conf)
      bannerRef.current.append(script)
    }
  }, [bannerRef])

  if (!process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_BANNER_KEY || !process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_BANNER_DOMAIN) {
    return null
  }

  return (
    <section className={ styles.mobileBanner__container } >
      <div ref={ bannerRef } className={ styles.mobileBanner__bannerContainer } />
      <div id={ `atContainer-${process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_BANNER_KEY ?? ''}` } />
      { t('banner_ad_title') }
    </section>
  )
}
