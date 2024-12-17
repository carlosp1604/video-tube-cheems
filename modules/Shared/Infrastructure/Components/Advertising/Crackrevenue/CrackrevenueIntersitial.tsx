import { FC } from 'react'
import Script from 'next/script'

/* eslint max-len: 0 */
export const CrackrevenueIntersitial: FC = () => {
  if (
    !process.env.NEXT_PUBLIC_CR_INTERSITIAL_URL ||
    !process.env.NEXT_PUBLIC_CR_INTERSITIAL_SCRIPT_URL ||
    !process.env.NEXT_PUBLIC_CR_INTERSITIAL_CONTENT_URL
  ) {
    return null
  }

  return (
    <>
      <Script src={ process.env.NEXT_PUBLIC_CR_INTERSITIAL_SCRIPT_URL }/>
      <Script id={ 'crackrevenue-intersitial' }>
        { `
          var crakPopInParams = {
            url: '${process.env.NEXT_PUBLIC_CR_INTERSITIAL_URL}',
            decryptUrl: false,
            contentUrl: '${process.env.NEXT_PUBLIC_CR_INTERSITIAL_CONTENT_URL}',
            decryptContentUrl: false,
            contentType: 'iframe',
            width: '85%',
            height: '85%',
            timeout: false,
            delayClose: 0,
            clickStart: false,
            closeIntent: false,
            postitialBehavior: true,
            closeButtonColor: '#000',
            closeCrossColor: '#fff',
            shadow: true,
            shadowColor: '#000',
            shadowOpacity: '.5',
            shadeColor: '#111',
            shadeOpacity: '0',
            border: '1px',
            borderColor: '#000',
            borderRadius: '0px',
            leadOut: true,
            animation: 'slide',
            direction: 'up',
            verticalPosition: 'center',
            horizontalPosition: 'center',
            expireDays: 0.01
          };
            ` }
      </Script>
    </>
  )
}
