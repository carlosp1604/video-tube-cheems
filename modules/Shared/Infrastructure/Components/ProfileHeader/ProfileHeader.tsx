import { FC, ReactElement } from 'react'
import styles from './ProfileHeader.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

export interface Props {
  name: string
  profileType: string
  subtitle: string
  icon: ReactElement
  imageUrl: string | null
  imageAlt: string
}

export interface OptionalProfileHeaderProps {
  color: string
}

export const ProfileHeader: FC<Props & Partial<OptionalProfileHeaderProps>> = ({
  name,
  profileType,
  subtitle,
  icon,
  imageUrl,
  imageAlt,
  color = undefined,
}) => {
  return (
    <header className={ styles.profileHeader__container }>
      <div className={ styles.profileHeader__nameImageContainer } >
        <AvatarImage
          imageUrl={ imageUrl }
          avatarClassName={ styles.profileHeader__avatar }
          imageClassName={ styles.profileHeader__image }
          avatarName={ name }
          imageAlt={ imageAlt }
          rounded={ false }
          color={ color ?? 'black' }
        />

        <h1 className={ styles.profileHeader__name }>
          { name }
          <small className={ styles.profileHeader__profileType }>
            <span className={ styles.profileHeader__icon }>
            { icon }
            </span>
            { profileType }
          </small>
          <small className={ styles.profileHeader__subtitle }>
            { subtitle }
          </small>
        </h1>
      </div>
    </header>
  )
}
