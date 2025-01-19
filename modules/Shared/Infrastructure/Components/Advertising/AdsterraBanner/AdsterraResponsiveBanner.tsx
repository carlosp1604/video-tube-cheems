import { FC, useEffect, useState } from 'react'
import {
  AdsterraDesktopBanner
} from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraDesktopBanner'
import { AdsterraBanner } from '~/modules/Shared/Infrastructure/Components/Advertising/AdsterraBanner/AdsterraBanner'
import { useMediaQuery } from '~/hooks/MediaQuery'

export const AdsterraResponsiveBanner: FC = () => {
  const [showMobile, setShowMobile] = useState(false)
  const [showDesktop, setShowDesktop] = useState(false)

  const activeBreakpoint = useMediaQuery()

  useEffect(() => {
    if (activeBreakpoint === 'default' || activeBreakpoint === 'sm' || activeBreakpoint === 'tb') {
      setShowMobile(true)
      setShowDesktop(false)
    }

    if (
      activeBreakpoint === 'md' ||
      activeBreakpoint === 'lg' ||
      activeBreakpoint === 'xl' ||
      activeBreakpoint === '2xl'
    ) {
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
