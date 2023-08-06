import Avatar from 'react-avatar'
import { FC } from 'react'

export interface Props {
  onClick: (() => void) | undefined
  name: string
}

export const InitialsAvatar: FC<Props> = ({ onClick, name }) => {
  return (
    <Avatar
      name={ name }
      textSizeRatio={ 5 }
      onClick={ () => {
        if (onClick) {
          onClick()
        }
      } }
    />
  )
}
