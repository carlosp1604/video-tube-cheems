import styles from './SearchPage.module.scss'
import { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  PaginatedPostCardGallery
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { useTranslation } from 'next-i18next'
import {
  HomePostsDefaultSortingOption,
  HomePostsSortingOptions, SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'

export interface SearchPageProps {
  posts: PostCardComponentDto[]
  postsNumber: number
  title: string
}

export const SearchPage: NextPage<SearchPageProps> = ({ posts, title, postsNumber }) => {
  const { t } = useTranslation('search')
  const [titleFilter, setTitleFilter] = useState<FetchPostsFilter>({
    type: PostFilterOptions.POST_TITLE,
    value: title,
  })

  const router = useRouter()

  if (router.query.search && router.query.search !== titleFilter.value) {
    setTitleFilter({
      ...titleFilter,
      value: router.query.search.toString(),
    })
  }

  const fetchPosts = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getPosts(
        pageNumber,
        defaultPerPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  return (
    <div className={ styles.searchPage__container }>
      <PaginatedPostCardGallery
        defaultSortingOption={ HomePostsDefaultSortingOption }
        sortingOptions={ HomePostsSortingOptions }
        initialPosts={ posts }
        initialPostsNumber={ postsNumber }
        filters={ [titleFilter] }
        title={ t('search_result_title', { searchTerm: title }) }
        fetchPosts={ fetchPosts }
        postCardOptions={ [] }
      />
    </div>
  )
}
