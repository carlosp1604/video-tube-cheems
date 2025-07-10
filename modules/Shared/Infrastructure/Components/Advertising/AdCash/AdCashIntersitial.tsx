import { useEffect, useState } from 'react'
import { useAdCash } from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashScript'

export default function AdCashIntersitial () {
  const { loaded } = useAdCash()
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (
      loaded &&
      !rendered &&
      window.aclib &&
      typeof window.aclib?.runInterstitial === 'function'
    ) {
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.innerHTML = `
        aclib.runInterstitial({
          zoneId: '10157158',
        });
      `

      document.body.appendChild(script)

      setRendered(true)
    }
  }, [loaded, rendered])

  return null
}
