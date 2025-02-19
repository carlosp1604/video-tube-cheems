import { FC, useState } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import styles from './TopVideoPosts.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { DropdownMenu } from '~/components/DropdownMenu/DropdownMenu'
import { BsSortDown } from 'react-icons/bs'

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

  const topOptions = (
    <DropdownMenu
      options={ [
        {
          title: t('top_posts_day_option_button_title'),
          active: currentOption === 'day',
          onClick: () => setCurrentOption('day'),
        },
        {
          title: t('top_posts_week_option_button_title'),
          active: currentOption === 'week',
          onClick: () => setCurrentOption('week'),
        },
        {
          title: t('top_posts_month_option_button_title'),
          active: currentOption === 'month',
          onClick: () => setCurrentOption('month'),
        },
      ] }
      title={ currentOption === 'day'
        ? t('top_posts_day_option_button_title')
        : currentOption === 'week'
          ? t('top_posts_week_option_button_title')
          : t('top_posts_month_option_button_title') }
      position={ 'right' }
      icon={ <BsSortDown /> }
    />
  )

  return (
    <div className={ styles.topVideoPosts__container }>
      <CommonGalleryHeader
        title={ 'top:top_posts_title' }
        subtitle={ '' }
        term={ { title: 'date', value: date } }
        sortingMenu={ topOptions }
      />

      <PostCardGallery
        posts={ postsToShow }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      />
    </div>
  )
}
