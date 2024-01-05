import { FC } from 'react'
import styles from './UserProfileHeader.module.scss'
import { useTranslation } from 'next-i18next'
import { BiCalendarEvent, BiIdCard } from 'react-icons/bi'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

interface Props {
  componentDto: UserProfileHeaderComponentDto
}

export const UserProfileHeader: FC<Props> = ({ componentDto }) => {
  const { t } = useTranslation('user_profile')

  return (
    <div className={ styles.userProfileHeader__container }>
      <div className={ styles.userProfileHeader__userData }>
        <AvatarImage
          imageUrl={ componentDto.imageUrl }
          avatarClassName={ styles.userProfileHeader__userAvatarContainer }
          imageClassName={ styles.userProfileHeader__userAvatarImage }
          avatarName={ componentDto.name }
          size={ '120' }
          round={ true }
          imageAlt={ t('user_profile_image_alt_title', { username: componentDto.username }) }
          priority={ true }
        />
        { `@${componentDto.username}` }
      </div>

      <div className={ styles.userProfileHeader__userInfoContainer }>
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
      </div>
    </div>
  )
}
