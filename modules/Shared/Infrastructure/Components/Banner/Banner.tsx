import { createRef, FC, useEffect } from 'react'
import styles from './Banner.module.scss'
import { useTranslation } from 'next-i18next'

export interface Props {
  adKey: string
  domain: string
}

export const Banner: FC<Props> = ({ domain, adKey }) => {
  const { t } = useTranslation('common')
  const bannerRef = createRef<HTMLDivElement>()

  const atOptions = {
    key: adKey,
    format: 'iframe',
    height: 250,
    width: 300,
    params: {},
  }

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement('script')
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.src = `//${domain}/${atOptions.key}/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      bannerRef.current.append(conf)
      bannerRef.current.append(script)
    }
  }, [bannerRef])

  return (
    <section className={ styles.banner__container }>
      <div ref={ bannerRef } className={ styles.banner__bannerContainer } />
      { t('banner_ad_title') }
    </section>
  )
}
