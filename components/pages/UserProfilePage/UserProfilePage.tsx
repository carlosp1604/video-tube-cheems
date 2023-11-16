import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './UserProfilePage.module.scss'
import { PostCardCarousel } from '~/modules/Posts/Infrastructure/Components/PostCardCarrousel/PostCardCarousel'
import { useTranslation } from 'next-i18next'

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
  savedPosts: PostCardComponentDto[]
  historyPosts: PostCardComponentDto[]
}

export const UserProfilePage: NextPage<UserProfilePageProps> = ({
  userComponentDto,
  savedPosts,
  historyPosts,
}) => {
  const { t } = useTranslation('user_profile')

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <div className={ styles.userProfilePage__userPosts }>
        <div className={ styles.userProfilePage__userPostsHeader }>
          { t('user_saved_posts_title') }
          <button
            className={ styles.userProfilePage__userPostsSeeAllButton }
            title={ t('see_all_button_title') }
          >
            { t('see_all_button_title') }
          </button>
        </div>
        <PostCardCarousel posts={ savedPosts } />
      </div>

      <div className={ styles.userProfilePage__userPosts }>
        <div className={ styles.userProfilePage__userPostsHeader }>
          { t('user_history_title') }
          <button
            className={ styles.userProfilePage__userPostsSeeAllButton }
            title={ t('see_all_button_title') }
          >
            { t('see_all_button_title') }
          </button>
        </div>
        <PostCardCarousel posts={ historyPosts } />
      </div>

    </div>
  )
}
