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
      className={ `bg-brand-400 text-base-50 text-base
        rounded-xl py-1.5 px-2.5` }
      opacity={ 1 }
      place={ place }
    />
  )
}
