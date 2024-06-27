import { FC } from 'react'
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip'

interface Props {
  tooltipId: string
  place: PlacesType
}

export const Tooltip: FC<Partial<Props> & Pick<Props, 'tooltipId'>> = ({ tooltipId, place = 'top' }) => {
  return (
    <ReactTooltip
      id={ tooltipId }
      className={ `bg-tooltip text-base-300 font-normal text-xs 
      tb:text-sm md:text-base rounded-md py-1.5 px-2.5 opacity-100 
      z-tooltip` }
      place={ place }
      noArrow={ true }
    />
  )
}
