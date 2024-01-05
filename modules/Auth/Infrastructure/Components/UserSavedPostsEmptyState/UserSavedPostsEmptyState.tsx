import { FC } from 'react'
import styles from './UserSavedPostsEmptyState.module.scss'
import { useTranslation } from 'next-i18next'
import { BsBookmark, BsThreeDotsVertical } from 'react-icons/bs'

export const UserSavedPostsEmptyState: FC = () => {
  const { t } = useTranslation('user_profile')

  return (
    <div className={ styles.userSavedPostsEmptyState__container }>
      <span className={ styles.userSavedPostsEmptyState__header }>
        { t('user_saved_posts_empty_state_title') }
        <small className={ styles.userSavedPostsEmptyState__headerSubtitle }>
        { t('user_saved_posts_empty_state_subtitle') }
        </small>
      </span>

      <div className={ styles.userSavedPostsEmptyState__option }>
        { t('user_saved_posts_empty_state_first_option_title') }
        <div className={ styles.userSavedPostsEmptyState__explatantionItem }>
          { t('user_saved_posts_empty_state_first_option_first_step') }
          <span className={ styles.userSavedPostsEmptyState__postOptionsExample }>
            <BsThreeDotsVertical />
          </span>
        </div>
        <div className={ styles.userSavedPostsEmptyState__explatantionItem }>
          { t('user_saved_posts_empty_state_first_option_second_step') }
          <div className={ styles.userSavedPostsEmptyState__menuItem }>
            <div className={ styles.userSavedPostsEmptyState__menuItemContent }>
              <span className={ styles.userSavedPostsEmptyState__menuIcon }>
                <BsBookmark />
              </span>
              { t('user_saved_posts_empty_state_post_options_save_post_button_title') }
            </div>
          </div>
        </div>
      </div>
      <div className={ styles.userSavedPostsEmptyState__option }>
        { t('user_saved_posts_empty_state_second_option_title') }
        <div className={ styles.userSavedPostsEmptyState__explatantionItem }>
          { t('user_saved_posts_empty_state_second_option_first_step') }

          <span className={ styles.userSavedPostsEmptyState__optionItem }>
            <BsBookmark />
            { t('user_saved_posts_empty_state_post_post_options_save_button_title') }
          </span>
        </div>
      </div>
    </div>
  )
}
