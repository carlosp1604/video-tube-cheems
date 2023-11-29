import { FC } from 'react'
import styles from './PostCardGalleryHeader.module.scss'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { BsDot } from 'react-icons/bs'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'

interface Props {
  title: string
  subtitle: string
  showSortingOptions: boolean
  activeOption: PostsPaginationSortingType
  sortingOptions: PostsPaginationSortingType[]
  onChangeOption: (option: PostsPaginationSortingType) => void
}

export const PostCardGalleryHeader: FC<Props> = ({
  title,
  subtitle,
  showSortingOptions,
  activeOption,
  sortingOptions,
  onChangeOption,
}) => {
  return (
    <div className={ styles.postCardGalleryHeader__container }>
      <span className={ styles.postCardGalleryHeader__title }>
        { title }
        <BsDot className={ styles.postCardGalleryHeader__separatorIcon }/>
        <small className={ styles.postCardGalleryHeader__videosQuantity }>
          { subtitle }
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
