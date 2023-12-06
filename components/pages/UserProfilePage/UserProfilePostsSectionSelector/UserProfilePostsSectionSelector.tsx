import { FC } from 'react'
import styles from './UserProfilePostsSectionSelector.module.scss'
import { BsBookmark, BsClockHistory } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'

export type UserProfilePostsSectionSelectorType = 'savedPosts' | 'history'
export const UserProfilePostsSectionSelectorTypes: UserProfilePostsSectionSelectorType[] =
  ['savedPosts', 'history']

interface Props {
  selectedSection: UserProfilePostsSectionSelectorType
  onClickOption: (section: UserProfilePostsSectionSelectorType) => void
  disabled: boolean
}

export const UserProfilePostsSectionSelector: FC<Props> = ({ selectedSection, onClickOption, disabled }) => {
  const { t } = useTranslation('user_profile')

  return (
    <div className={ styles.userProfilePostsSectionSelector__container }>
      <button className={ `
        ${styles.userProfilePostsSectionSelector__option}
        ${selectedSection === 'savedPosts' ? styles.userProfilePostsSectionSelector__option_active : ''}
      ` }
        onClick={ () => {
          if (selectedSection !== 'savedPosts') { onClickOption('savedPosts') }
        } }
        title={ t('user_saved_posts_selector_button_title') }
        disabled={ disabled }
      >
        <span className={ styles.userProfilePostsSectionSelector__optionIconWrapper }>
          <BsBookmark className={ styles.userProfilePostsSectionSelector__optionIcon }/>
        </span>
        { t('user_saved_posts_selector_button_title') }
      </button>

      <button className={ `
        ${styles.userProfilePostsSectionSelector__option}
        ${selectedSection === 'history' ? styles.userProfilePostsSectionSelector__option_active : ''}
      ` }
        onClick={ () => {
          if (selectedSection !== 'history' && !disabled) { onClickOption('history') }
        } }
        title={ t('user_history_selector_button_title') }
        disabled={ disabled }
      >
        <span className={ styles.userProfilePostsSectionSelector__optionIconWrapper }>
          <BsClockHistory className={ styles.userProfilePostsSectionSelector__optionIcon }/>
        </span>
        { t('user_history_selector_button_title') }
      </button>
    </div>
  )
}
