import { useEffect, useRef, useState } from 'react'
import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'
import { useAdCash } from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashScript'

export default function AdCash728x90Banner () {
  const { loaded } = useAdCash()
  const bannerRef = useRef<HTMLDivElement>(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (
      loaded &&
      bannerRef.current &&
      !rendered &&
      window.aclib &&
      typeof window.aclib?.runBanner === 'function' &&
      !bannerRef.current.firstChild
    ) {
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.innerHTML = `
        aclib.runBanner({
          zoneId: '10133230',
        });
      `

      bannerRef.current.append(script)

      setRendered(true)
    }
  }, [loaded, rendered])

  return (
    <div className={ styles.banner__bannerWrapper90x729 }>
      <div ref={ bannerRef } />
    </div>
  )
}
