import { CSSProperties, FC } from 'react'
import styles from './ProfileHeader.module.scss'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

export interface Props {
  name: string
  imageUrl: string | null
  imageAlt: string
  customColor: string | null
  rounded: boolean
}

export const ProfileHeader: FC<Props> = ({ name, imageUrl, imageAlt, customColor, rounded }) => {
  return (
      <header className={ styles.profileHeader__container }>
        <div
          className={ styles.profileHeader__background }
          style={ {
            '--custom-color': customColor ?? '#834f23',
          } as CSSProperties }
        />
        { /**
          <Image
            src={ actor.backgroundImage }
            width={ 0 }
            height={ 0 }
            sizes={ '100vw' }
            alt={ 'aaa' }
            className={ styles.actorProfileHeader__backgroundImage }
          />
        **/ }
        <div className={ styles.profileHeader__infoContainer }>
          <div className={ styles.profileHeader__nameImageContainer } >
            <AvatarImage
              imageUrl={ imageUrl }
              avatarClassName={ `
                ${styles.profileHeader__avatar}
                ${rounded ? styles.profileHeader__avatar__rounded : ''}
              ` }
              imageClassName={ styles.profileHeader__image }
              avatarName={ name }
              imageAlt={ imageAlt }
              color={ customColor !== null ? customColor : undefined }
              rounded={ rounded }
            />

            <h1 className={ styles.profileHeader__name }>
              { name }
            </h1>
        </div>
      </div>
    </header>
  )
}
