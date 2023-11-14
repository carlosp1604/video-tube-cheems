import { FC } from 'react'
import styles from './PostCardGalleryHeader.module.scss'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { BsDot } from 'react-icons/bs'
import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { useTranslation } from 'next-i18next'

interface Props {
  title: string
  postsNumber: number
  showSortingOptions: boolean
  activeOption: PostsPaginationOrderType
  sortingOptions: PostsPaginationOrderType[]
  onChangeOption: (option: PostsPaginationOrderType) => void
}

export const PostCardGalleryHeader: FC<Props> = ({
  title,
  postsNumber,
  showSortingOptions,
  activeOption,
  sortingOptions,
  onChangeOption,
}) => {
  const { t } = useTranslation('home_page')

  return (
    <div className={ styles.postCardGalleryHeader__container }>
      <span className={ styles.postCardGalleryHeader__title }>
        { title }
        <BsDot className={ styles.postCardGalleryHeader__separatorIcon }/>
        <small className={ styles.postCardGalleryHeader__videosQuantity }>
          { t('gallery_posts_count_title', { videosNumber: postsNumber }) }
        </small>
      </span>

      { showSortingOptions
        ? <SortingMenuDropdown
          activeOption={ activeOption }
          options={ sortingOptions }
          onChangeOption={ onChangeOption }
        />
        : null
      }

    </div>
  )
}
