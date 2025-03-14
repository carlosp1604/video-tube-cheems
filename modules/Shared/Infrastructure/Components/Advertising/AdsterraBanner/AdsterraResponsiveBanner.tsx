import { FC, useEffect, useState } from 'react'
import { AdsterraBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraBanner'
import {
  AdsterraDesktopBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraDesktopBanner'
import { MediaQueryBreakPoints, useMediaQuery } from '~/hooks/MediaQuery'

export const AdsterraResponsiveBanner: FC = () => {
  const [showMobile, setShowMobile] = useState(false)
  const [showDesktop, setShowDesktop] = useState(false)

  const activeBreakpoint = useMediaQuery()

  useEffect(() => {
    if (activeBreakpoint <= MediaQueryBreakPoints.TB) {
      setShowMobile(true)
      setShowDesktop(false)
    }

    if (activeBreakpoint >= MediaQueryBreakPoints.MD) {
      setShowDesktop(true)
      setShowMobile(false)
    }
  }, [activeBreakpoint])

  return (
    <>
      { showDesktop && <AdsterraDesktopBanner showAdLegend={ false }/> }
      { showMobile && <AdsterraBanner showAdLegend={ false }/> }
    </>
  )
}
