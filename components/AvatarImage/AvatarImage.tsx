import { FC } from 'react'
import Avatar from 'react-avatar'
import Image from 'next/image'

interface Props {
  imageUrl: string | null
  avatarClassName: string
  imageClassName: string
  avatarName: string
  size: string
  round: boolean
  imageAlt: string
  priority: boolean
}

export const AvatarImage: FC<Partial<Props> & Omit<Props, 'priority'>> = ({
  imageUrl,
  avatarClassName,
  avatarName,
  imageClassName,
  imageAlt,
  size,
  round,
  priority = false,
}) => {
  let avatar = (
    <Avatar
      className={ avatarClassName }
      round={ round }
      size={ size }
      name={ avatarName }
      textSizeRatio={ 2 }
      maxInitials={ 2 }
    />
  )

  if (imageUrl !== null) {
    avatar = (
      <Image
        alt={ imageAlt }
        className={ imageClassName }
        src={ imageUrl }
        width={ 0 }
        height={ 0 }
        sizes={ '100vw' }
        priority={ priority }
      />
    )
  }

  return (avatar)
}
