import { FC } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import styles from './TopVideoPosts.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { DropdownMenu } from '~/components/DropdownMenu/DropdownMenu'
import { BsSortDown } from 'react-icons/bs'

type TopOptions = 'day' | 'week' | 'month'

interface Props {
  posts: Array<PostCardComponentDto>
  currentDate: string
  currentOption: string
}

export const TopVideoPosts: FC<Props> = ({
  posts,
  currentDate,
  currentOption,
}) => {
  const { t } = useTranslation('top')

  const topOptions = (
    <DropdownMenu
      options={ [
        {
          title: t('top_posts_day_option_button_title'),
          active: currentOption === 'day',
          link: {
            href: '/posts/top',
          },
        },
        {
          title: t('top_posts_week_option_button_title'),
          active: currentOption === 'week',
          link: {
            href: '/posts/top/week',
          },
        },
        {
          title: t('top_posts_month_option_button_title'),
          active: currentOption === 'month',
          link: {
            href: '/posts/top/month',
          },
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
        term={ { title: 'date', value: currentDate } }
        sortingMenu={ topOptions }
      />

      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      />
    </div>
  )
}
