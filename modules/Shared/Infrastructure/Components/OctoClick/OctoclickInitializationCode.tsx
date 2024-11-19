import { FC, useEffect, useState } from 'react'
import Script from 'next/script'

interface Props {
  onRender: () => void
}

export const OctoclickInitializationCode: FC<Props> = ({ onRender }) => {
  const [exists, setExists] = useState<boolean>(false)

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID &&
        !exists
    ) {
      const script = document.querySelector(`[data-id="${process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID}"]`)

      if (script) {
        setExists(true)
        onRender()
      }
    }
  })

  if (!process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID) {
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
