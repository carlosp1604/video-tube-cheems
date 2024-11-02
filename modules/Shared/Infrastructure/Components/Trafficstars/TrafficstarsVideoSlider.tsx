import { FC, useState } from 'react'
import Script from 'next/script'

export const TrafficstarsVideoSlider: FC = () => {
  const [mainScriptLoad, setMainScriptLoad] = useState<boolean>(false)

  if (!process.env.NEXT_PUBLIC_TS_VIDEO_SLIDER_SPOT_ID || !process.env.NEXT_PUBLIC_TS_VIDEO_SLIDER_SPOT_URL) {
    return null
  }

  return (
    <>
      <Script
        src={ process.env.NEXT_PUBLIC_TS_VIDEO_SLIDER_SPOT_URL }
        onLoad={ () => setMainScriptLoad(true) }
      />
      {
        mainScriptLoad &&
          <Script id={ 'trafficstars-outstream' } strategy={ 'afterInteractive' }>
            { `
              TSVideoInstantMessage({
                spot: "${process.env.NEXT_PUBLIC_TS_VIDEO_SLIDER_SPOT_ID}",
                width: "10%",
                mobileWidth: "20%",
                displayMode: "capped",
                cappedAction: "click",
                cappedValueInMinutes: 10,
                showCTAButton: true,
                hideOnComplete: false
              });
            ` }
          </Script>
      }
    </>
  )
}
