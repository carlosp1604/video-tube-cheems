import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import useTranslation from 'next-translate/useTranslation'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  PaginatedPostCardGallery
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export interface Props {
  initialSearchTerm: string
  initialPage: number
  initialSortingOption: PostsPaginationSortingType
}

export const Search: FC<Props> = ({
  initialSearchTerm,
  initialPage,
  initialSortingOption,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm)
  const { t } = useTranslation('search')
  const router = useRouter()
  const locale = router.locale ?? 'en'

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: false,
  }

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

  const onFetchNewPosts = (filters: FetchFilter<PostFilterOptions>[]) => {
    const searchTitleFilter = filters.find((filter) =>
      filter.type === FilterOptions.POST_TITLE
    )

    if (!searchTitleFilter || !searchTitleFilter.value) {
      router.replace('/posts/search', { query: { search: '' } })

      return
    }

    setSearchTerm(searchTitleFilter.value)
  }

  return (
    <PaginatedPostCardGallery
      key={ locale }
      headerTag={ 'h1' }
      title={ 'search:search_result_title' }
      subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
      term={ { title: 'searchTerm', value: searchTerm } }
      page={ initialPage }
      order={ initialSortingOption }
      filters={ [{ type: FilterOptions.SEARCH, value: initialSearchTerm }] }
      filtersToParse={ [FilterOptions.SEARCH] }
      paginatedPostCardGalleryPostCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      linkMode={ linkMode }
      sortingOptions={ sortingOptions }
      defaultSortingOption={ PaginationSortingType.LATEST }
      onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
      emptyState={ emptyState }
      onPaginationStateChanges={ (_page, _order, filters) => onFetchNewPosts(filters) }
    />
  )
}
