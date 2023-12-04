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
  loading: boolean
}

export const PostCardGalleryHeader: FC<Partial<Props> & Omit<Props, 'loading'>> = ({
  title,
  subtitle,
  showSortingOptions,
  activeOption,
  sortingOptions,
  onChangeOption,
  loading = false,
}) => {
  return (
    <div className={ styles.postCardGalleryHeader__container }>
      <div className={ styles.postCardGalleryHeader__title }>
        { title }
        <BsDot className={ styles.postCardGalleryHeader__separatorIcon }/>
        { loading
          ? <span className={ styles.postCardGalleryHeader__videosQuantitySkeeleton }/>
          : <small className={ styles.postCardGalleryHeader__videosQuantity }>
              { subtitle }
            </small>
        }
      </div>

      { showSortingOptions || loading
        ? <SortingMenuDropdown
          activeOption={ activeOption }
          options={ sortingOptions }
          onChangeOption={ onChangeOption }
          loading={ loading }
        />
        : null
      }

    </div>
  )
}
