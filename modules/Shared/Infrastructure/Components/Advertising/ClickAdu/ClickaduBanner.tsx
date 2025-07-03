import { createRef, FC, useEffect } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'

export const ClickaduBanner: FC = () => {
  const bannerRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const script = document.createElement('script', { is: 'custom-script' })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      script['data-cfasync'] = 'false'
      script.className = '__clb-2029926'
      script.type = 'text/javascript'
      script.src = process.env.NEXT_PUBLIC_MOBILE_CLICKADU_BANNER_URL ?? ''

      bannerRef.current.append(script)
    }
  }, [bannerRef])

  if (!process.env.NEXT_PUBLIC_MOBILE_CLICKADU_BANNER_URL) {
    return null
  }

  return (
    <div className={ styles.banner__container }>
      <div ref={ bannerRef } className={ styles.banner__bannerContainer100x300 } />
    </div>
  )
}
