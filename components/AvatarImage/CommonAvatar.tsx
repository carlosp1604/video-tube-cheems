import { CSSProperties, FC } from 'react'
import Avatar from 'react-avatar'
import styles from './CommonAvatar.module.scss'
import { useAvatarColor } from '~/hooks/AvatarColor'

interface Props {
  className: string
  avatarName: string
  color: string | undefined
}

// TODO: Generate a random color based on user name
export const CommonAvatar: FC<Partial<Props> & Omit<Props, 'color'>> = ({
  className,
  avatarName,
  color = undefined,
}) => {
  const getRandomColor = useAvatarColor()

  return (
    <div className={ `
        ${className}
        ${styles.commonAvatar__container}
      ` }
      style={ {
        '--custom-color': color ?? getRandomColor(avatarName),
      } as CSSProperties }>
      <Avatar
        className={ styles.commonAvatar__avatarContainer }
        name={ avatarName }
        textSizeRatio={ 2 }
        maxInitials={ 2 }
        unstyled={ true }
      />
    </div>

  )
}
