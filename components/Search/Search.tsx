import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  PaginatedPostCardGallerySSR
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallerySSR'

export interface Props {
  searchTerm: string
  page: number
  sortingOption: PostsPaginationSortingType
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const Search: FC<Props> = ({
  posts,
  postsNumber,
  searchTerm,
  page,
  sortingOption,
}) => {
  const { t, lang } = useTranslation('search')

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const emptyState = (
    <EmptyState
      title={ t('post_gallery_empty_state_title') }
      subtitle={ t('post_gallery_empty_state_subtitle', { searchTerm }) }
    />
  )

  return (
    <PaginatedPostCardGallerySSR
      headerTag={ 'h1' }
      title={ 'search:search_result_title' }
      subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, lang) }) }
      term={ { title: 'searchTerm', value: searchTerm } }
      page={ page }
      order={ sortingOption }
      sortingOptions={ sortingOptions }
      emptyState={ emptyState }
      postsNumber={ postsNumber }
      posts={ posts }
      paginatedPostCardGalleryPostCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
    />
  )
}
