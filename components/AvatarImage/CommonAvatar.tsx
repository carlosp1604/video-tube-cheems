import { CSSProperties, FC } from 'react'
import styles from './CommonAvatar.module.scss'
import { useAvatarColor } from '~/hooks/AvatarColor'

interface Props {
  className: string
  avatarName: string
  color: string | undefined
  rounded: boolean
}

export const CommonAvatar: FC<Partial<Props> & Omit<Props, 'color' | 'rounded'>> = ({
  className,
  avatarName,
  color = undefined,
  rounded = true,
}) => {
  const nameParts = avatarName.split(' ')
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : ''
  const lastNameInitial = nameParts[1] ? nameParts[1][0] : ''

  const getRandomColor = useAvatarColor()

  return (
    <div
      className={ `${className} ${styles.commonAvatar__container}` }
      style={ {
        '--custom-color': color && color !== '' ? color : getRandomColor(avatarName),
      } as CSSProperties }
      title={ `${firstNameInitial}${lastNameInitial}` }
    >
      <span
        className={ `
          ${styles.commonAvatar__avatarContainer}
          ${rounded ? styles.commonAvatar__avatarContainer__rounded : ''}
        ` }
      >
        { firstNameInitial }
        { lastNameInitial }
      </span>
    </div>
  )
}
