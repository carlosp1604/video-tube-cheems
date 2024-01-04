import { FC, ReactNode } from 'react'
import styles from './PostCardGalleryHeader.module.scss'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'

interface Props {
  title: string | ReactNode
  subtitle: string
  showSortingOptions: boolean
  activeOption: PostsPaginationSortingType
  sortingOptions: PostsPaginationSortingType[]
  loading: boolean
  linkMode: ElementLinkMode | undefined
  onClickOption: ((option: PostsPaginationSortingType) => void) | undefined
}

export const PostCardGalleryHeader: FC<Partial<Props> &
  Omit<Props, 'loading' | 'scrollOnClick' | 'shallowNavigation' | 'onClickOption' | 'replace' | 'linkMode'>> = ({
    title,
    subtitle,
    showSortingOptions,
    activeOption,
    sortingOptions,
    loading = false,
    linkMode = undefined,
    onClickOption = undefined,
  }) => {
    return (
    <div className={ styles.postCardGalleryHeader__container }>
      <h1 className={ styles.postCardGalleryHeader__title }>
        { title }
        { loading
          ? <span className={ styles.postCardGalleryHeader__videosQuantitySkeeleton }/>
          : <small className={ styles.postCardGalleryHeader__videosQuantity }>
              { subtitle }
            </small>
        }
      </h1>

      <SortingMenuDropdown
        activeOption={ activeOption }
        options={ sortingOptions }
        loading={ loading }
        visible={ showSortingOptions }
        onClickOption={ onClickOption }
        linkMode={ linkMode }
      />
    </div>
    )
  }
