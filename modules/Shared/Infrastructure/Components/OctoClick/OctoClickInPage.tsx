import { FC, useEffect, useState } from 'react'
import Script from 'next/script'

export const OctoClickInPage: FC = () => {
  const [bannerRendered, setBannerRendered] = useState<boolean>(false)

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_ZONE_ID &&
      process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID &&
      !bannerRendered
    ) {
      const script = document.querySelector(`[data-id="${process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID}"]`)

      if (script) {
        const divElement = document.createElement('div')

        divElement.id = process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_ZONE_ID
        divElement.className = process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID

        document.body.appendChild(divElement)

        setBannerRendered(true)
      }
    }
  }, [])

  if (!process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_ZONE_ID || !process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID) {
    return null
  }

  return (
    <Script
      id={ 'octoclick-in-page' }
      strategy={ 'afterInteractive' }
    >
      { ` 
        (function(o, c, t, l, i) {
          for (i = 0; i < o.scripts.length; i++) { if (o.scripts[i].src === c) { return; } }
          l = o.createElement("script");
          l.src = c + "?" + Date.now();
          l.setAttribute("async", "");
          l.setAttribute("data-id", t);
          o.body.appendChild(l);
        })(document, "https://Octo25.me/lib.js", "${process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID}");
      ` }
    </Script>
  )
}
