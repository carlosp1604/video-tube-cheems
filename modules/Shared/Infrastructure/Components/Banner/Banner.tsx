import { createRef, FC, useEffect } from 'react'
import styles from './Banner.module.scss'

export const Banner: FC = () => {
  const bannerRef = createRef<HTMLDivElement>()

  const atOptions = {
    key: '843c7af46a532f41e64e1628e2513235',
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
      script.src = `//contentmentfairnesspesky.com/${atOptions.key}/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      bannerRef.current.append(conf)
      bannerRef.current.append(script)
    }
  }, [bannerRef])

  return (
    <section className={ styles.banner__container }>
      <div ref={ bannerRef } className={ styles.banner__bannerContainer } />
      Publicidad
    </section>
  )
}
