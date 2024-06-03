import { FC, useState } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import styles from './TopVideoPosts.module.scss'
import useTranslation from 'next-translate/useTranslation'

type TopOptions = 'day' | 'week' | 'month'

interface Props {
  todayTopPosts: PostCardComponentDto[]
  weekTopPosts: PostCardComponentDto[]
  monthTopPosts: PostCardComponentDto[]
  currentDay: string
  currentMonth: string
  currentWeek: string
}

export const TopVideoPosts: FC<Props> = ({
  todayTopPosts,
  weekTopPosts,
  monthTopPosts,
  currentDay,
  currentMonth,
  currentWeek,
}) => {
  const { t } = useTranslation('top')
  const [currentOption, setCurrentOption] = useState<TopOptions>('day')

  let postsToShow = todayTopPosts
  let date = currentDay

  if (currentOption === 'week') {
    postsToShow = weekTopPosts
    date = currentWeek
  }

  if (currentOption === 'month') {
    postsToShow = monthTopPosts
    date = currentMonth
  }

  return (
    <div className={ styles.topVideoPosts__container }>
      <CommonGalleryHeader
        title={ 'top:top_posts_title' }
        subtitle={ '' }
        term={ { title: 'date', value: date } }
      />
      <div className={ styles.topVideoPosts__topOptionsContainer }>
        <CommonButton
          title={ t('top_posts_day_option_button_title') }
          disabled={ currentOption === 'day' }
          onClick={ () => setCurrentOption('day') }
        />
        <CommonButton
          title={ t('top_posts_week_option_button_title') }
          disabled={ currentOption === 'week' }
          onClick={ () => setCurrentOption('week') }
        />
        <CommonButton
          title={ t('top_posts_month_option_button_title') }
          disabled={ currentOption === 'month' }
          onClick={ () => setCurrentOption('month') }
        />
      </div>

      <PostCardGallery
        posts={ postsToShow }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      />
    </div>
  )
}
