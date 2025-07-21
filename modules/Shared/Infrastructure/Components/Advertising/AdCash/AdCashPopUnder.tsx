import { useEffect, useState } from 'react'
import { useAdCash } from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashScript'

export default function AdCashPopUnder () {
  const { loaded } = useAdCash()
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (
      loaded &&
      !rendered &&
      window.aclib &&
      typeof window.aclib?.runPop === 'function'
    ) {
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.innerHTML = `
        aclib.runPop({
          zoneId: '10200338',
        });
      `

      document.body.appendChild(script)

      setRendered(true)
    }
  }, [loaded, rendered])

  return null
}
