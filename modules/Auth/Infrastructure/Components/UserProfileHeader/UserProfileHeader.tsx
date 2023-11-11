import { FC } from 'react'
import styles from './UserProfileHeader.module.scss'
import Avatar from 'react-avatar'
import { useTranslation } from 'next-i18next'
import { BiCalendarEvent, BiIdCard } from 'react-icons/bi'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import Image from 'next/image'

interface Props {
  componentDto: UserProfileHeaderComponentDto
}

export const UserProfileHeader: FC<Props> = ({ componentDto }) => {
  const { t } = useTranslation('user_profile')

  let avatar = (
    <Avatar
      className={ styles.userProfileHeader__userAvatarContainer }
      round={ true }
      size={ '120' }
      name={ componentDto.name }
      textSizeRatio={ 2 }
    />
  )

  if (componentDto.imageUrl !== null) {
    avatar = (
      <Image
        alt={ t('user_profile_image_alt_title', { username: componentDto.username }) }
        className={ styles.userProfileHeader__userAvatarImage }
        src={ componentDto.imageUrl }
        width={ 0 }
        height={ 0 }
        sizes={ '100vw' }
      />
    )
  }

  return (
    <div className={ styles.userProfileHeader__container }>
      <div className={ styles.userProfileHeader__userData }>
        { avatar }
        { componentDto.username }
      </div>

      { /**
      <div className={ styles.userProfileHeader__userActivities }>
        <span className={ styles.userProfileHeader__activityItem }>
          4
          <small className={ styles.userProfileHeader__activityItemActivity }>
            Vistas
          </small>
        </span>

          <span className={ styles.userProfileHeader__activityItem }>
          40
          <small className={ styles.userProfileHeader__activityItemActivity }>
            Guardados
          </small>
        </span>

          <span className={ styles.userProfileHeader__activityItem }>
          400
          <small className={ styles.userProfileHeader__activityItemActivity }>
            Likes
          </small>
        </span>
        </div>
      */ }

      <div className={ styles.userProfileHeader__userInfo }>
        <div className={ styles.userProfileHeader__userInfoItem }>
          <BiCalendarEvent className={ styles.userProfileHeader__userInfoItemIcon }/>
          <span className={ styles.userProfileHeader__userInfoItemTitle }>
            { t('user_joined_at_label_title') }
          </span>
          <span className={ styles.userProfileHeader__userInfoItemContent }>
            { componentDto.createdAt }
          </span>
        </div>
        <div className={ styles.userProfileHeader__userInfoItem }>
          <BiIdCard className={ styles.userProfileHeader__userInfoItemIcon }/>
          <span className={ styles.userProfileHeader__userInfoItemTitle }>
            { t('user_name_label_title') }
          </span>
          <span className={ styles.userProfileHeader__userInfoItemContent }>
            { componentDto.name }
          </span>
        </div>
      </div>

      { /**
        <div className={ styles.userProfile__options }>
          <button className={ styles.userProfile__editProfileButton }>
            <BsPencil />
            { t('user_my_profile_button') }
          </button>
        </div>
      */ }

    </div>
  )
}
