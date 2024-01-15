import { FC } from 'react'
import Image from 'next/image'
import { CommonAvatar } from '~/components/AvatarImage/CommonAvatar'

interface Props {
  imageUrl: string | null
  avatarClassName: string
  imageClassName: string
  avatarName: string
  imageAlt: string
  priority: boolean
  color: string | undefined
}

export const AvatarImage: FC<Partial<Props> & Omit<Props, 'priority' | 'color'>> = ({
  imageUrl,
  avatarClassName,
  avatarName,
  imageClassName,
  imageAlt,
  priority = false,
  color = undefined,
}) => {
  let avatar = (
    <CommonAvatar className={ avatarClassName } avatarName={ avatarName } color={ color }/>
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
