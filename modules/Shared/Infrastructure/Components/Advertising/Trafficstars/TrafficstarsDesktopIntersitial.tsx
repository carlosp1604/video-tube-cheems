import { FC, useState } from 'react'
import Script from 'next/script'

export const TrafficstarsDesktopIntersitial: FC = () => {
  const [mainScriptLoad, setMainScriptLoad] = useState<boolean>(false)

  return (
    <>
      <link rel="stylesheet" href="//cdn.tsyndicate.com/sdk/v1/interstitial.ts.css"/>
      <Script
        src={ '//cdn.tsyndicate.com/sdk/v1/interstitial.ts.js' }
        onLoad={ () => setMainScriptLoad(true) }
      />
      {
        mainScriptLoad &&
        <Script id={ 'trafficstars-desktop-intersitial' } strategy={ 'afterInteractive' }>
          { `
            InterstitialTsAd({         
              spot: "7b03ac4ed7e446d4aeb366373a0ce701",
              countClicks: 1    
            });
            ` }
        </Script>
      }
    </>
  )
}
