import { FC } from 'react'
import styles from './UserProfileHeader.module.scss'
import Avatar from 'react-avatar'
import { useTranslation } from 'next-i18next'
import { BiCalendarEvent, BiIdCard } from 'react-icons/bi'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'

interface Props {
  componentDto: UserProfileHeaderComponentDto
}

export const UserProfileHeader: FC<Props> = ({ componentDto }) => {
  const { t } = useTranslation('user_profile')

  let avatar = (
    <Avatar
      className={ styles.userMenu__userAvatar }
      round={ true }
      size={ '120' }
      name={ componentDto.name }
      textSizeRatio={ 2 }
    />
  )

  if (componentDto.imageUrl !== null) {
    avatar = (
      <img
        className={ styles.userMenu__userAvatar }
        src={ componentDto.imageUrl }
        alt={ componentDto.name }
      />
    )
  }

  return (
    <div className={ styles.userProfile__container }>
      <div className={ styles.userProfile__userData }>
        { avatar }
        { componentDto.username }
      </div>

      { /**
        <div className={ styles.userProfile__userActivities }>
        <span className={ styles.userProfile__activityItem }>
          4
          <small className={ styles.userProfile__activityItemActivity }>
            Vistas
          </small>
        </span>

          <span className={ styles.userProfile__activityItem }>
          40
          <small className={ styles.userProfile__activityItemActivity }>
            Guardados
          </small>
        </span>

          <span className={ styles.userProfile__activityItem }>
          400
          <small className={ styles.userProfile__activityItemActivity }>
            Likes
          </small>
        </span>
        </div>
       */ }

      <div className={ styles.userProfile__userInfo }>
        <div className={ styles.userProfile__userInfoItem }>
          <BiCalendarEvent className={ styles.userProfile__userInfoItemIcon }/>
          <span className={ styles.userProfile__userInfoItemTitle }>
            { t('user_joined_at_label_title') }
          </span>
          { componentDto.createdAt }
        </div>
        <div className={ styles.userProfile__userInfoItem }>
          <BiIdCard className={ styles.userProfile__userInfoItemIcon }/>
          <span className={ styles.userProfile__userInfoItemTitle }>
            { t('user_name_label_title') }
          </span>
          { componentDto.name }
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
