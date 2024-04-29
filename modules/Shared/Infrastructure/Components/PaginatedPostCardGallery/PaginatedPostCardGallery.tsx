import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { FC, ReactElement, useEffect, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { useGetPosts } from '~/hooks/GetPosts'
import { useFirstRender } from '~/hooks/FirstRender'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import dynamic from 'next/dynamic'
import {
  PostCardDeletableOptions,
  PostCardOption, PostCardOptionConfiguration
} from '~/hooks/PostCardOptions'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import {
  CommonGalleryHeader, HeaderTag,
  TitleTerm
} from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'

const PaginationBar = dynamic(() =>
  import('~/components/PaginationBar/PaginationBar').then((module) => module.PaginationBar), { ssr: false }
)

export type PostsFetcher = (
  page: number,
  order: PostsPaginationSortingType,
  filters: FetchPostsFilter[]
) => Promise<GetPostsApplicationResponse | null>

export type PaginationStateChange = (
  pageNumber: number,
  order: PostsPaginationSortingType,
  filters: FetchPostsFilter[]
) => void

export type PaginatedPostCardGalleryPostCardOption = PostCardOption
export interface PaginatedPostCardGalleryPostCardDeletableOption {
  type: PostCardDeletableOptions
  onDelete: (posts: PostCardComponentDto[], postId: string, setPosts: (posts: PostCardComponentDto[]) => void) => void
  ownerId: string
}

export type PaginatedPostCardGalleryConfiguration =
  Partial<PaginatedPostCardGalleryPostCardOption> & Pick<PaginatedPostCardGalleryPostCardOption, 'type'> |
    PaginatedPostCardGalleryPostCardDeletableOption

interface PaginationState {
  page: number
  order: PostsPaginationSortingType
  filters: FetchPostsFilter[]
}

export interface Props {
  title: string
  term: TitleTerm | undefined
  headerTag: HeaderTag
  subtitle: string
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[] | undefined
  initialPostsNumber: number | undefined
  filters: FetchPostsFilter[]
  filtersToParse: PostFilterOptions[]
  paginatedPostCardGalleryPostCardOptions: PaginatedPostCardGalleryConfiguration[]
  linkMode: ElementLinkMode | undefined
  sortingOptions: PostsPaginationSortingType[]
  defaultSortingOption: PostsPaginationSortingType
  onPostsFetched: (postsNumber: number, posts: PostCardComponentDto[]) => void
  emptyState: ReactElement
  onPaginationStateChanges: PaginationStateChange | undefined
  customPostsFetcher: PostsFetcher | undefined
}

export const PaginatedPostCardGallery: FC<Partial<Props> & Omit<Props,
  'term' | 'initialPostsNumber' | 'initialPosts' | 'linkMode' | 'onPaginationStateChanges' | 'customPostsFetcher'
>> = ({
  title,
  term = undefined,
  headerTag,
  subtitle,
  initialPostsNumber = undefined,
  initialPosts = undefined,
  page,
  order,
  filtersToParse,
  filters,
  paginatedPostCardGalleryPostCardOptions,
  linkMode = undefined,
  sortingOptions,
  defaultSortingOption,
  emptyState,
  onPaginationStateChanges = undefined,
  onPostsFetched,
  customPostsFetcher = undefined,
}) => {
  const [posts, setPosts] =
    useState<PostCardComponentDto[]>(initialPosts ?? [])
  const [postsNumber, setPostsNumber] =
    useState<number>(initialPostsNumber ?? 0)
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const { query, asPath } = router
  const locale = router.locale ?? 'en'
  const { getPosts } = useGetPosts()
  const firstRender = useFirstRender()
  const { setBlocked } = useUsingRouterContext()

  const [paginationState, setPaginationState] = useState<PaginationState>({
    page,
    order,
    filters,
  })

  // TODO: Add support to change perPage prop
  const configuration: Omit<PostsPaginationConfiguration, 'perPage'> = {
    page: {
      defaultValue: 1,
      maxValue: Infinity,
      minValue: 1,
    },
    filters: {
      filtersToParse,
    },
    sortingOptionType: {
      defaultValue: defaultSortingOption,
      parseableOptionTypes: sortingOptions,
    },
  }

  const updatePosts = async (page:number, order: PostsPaginationSortingType, filters: FetchPostsFilter[]) => {
    setLoading(true)

    const parsedFilters = filters.map((filter) => {
      return {
        type: PostsPaginationQueryParams.getFilterAlias(filter.type),
        value: filter.value,
      }
    })

    let fetchPosts = customPostsFetcher

    if (!fetchPosts) {
      fetchPosts = getPosts
    }

    const newPosts =
      await fetchPosts(page, order, parsedFilters)

    if (newPosts) {
      const newPostsCards = newPosts.posts.map((post) => {
        return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
      })

      setPostsNumber(newPosts.postsNumber)
      setPosts(newPostsCards)
      onPostsFetched(newPosts.postsNumber, newPostsCards)
    }

    setLoading(false)
  }

  const arraysEqual = (currentFiltersArray: FetchPostsFilter[], newFiltersArray: FetchPostsFilter[]) => {
    if (currentFiltersArray.length !== newFiltersArray.length) {
      return false
    }

    for (const currentFilterArray of currentFiltersArray) {
      const foundOnNewArray = newFiltersArray.find((newFilter) =>
        newFilter.type === currentFilterArray.type && newFilter.value === currentFilterArray.value
      )

      if (!foundOnNewArray) {
        return false
      }

      const index = newFiltersArray.indexOf(foundOnNewArray)

      newFiltersArray.splice(index, 1)
    }

    return true
  }

  useEffect(() => {
    if (firstRender && initialPostsNumber === undefined) {
      setBlocked(true)
      updatePosts(paginationState.page, paginationState.order, paginationState.filters)
        .then(() => {
          // onFetchNewPosts(newPage, newOrder, newFilters)
          setBlocked(false)
        })

      return
    }

    const queryParams = new PostsPaginationQueryParams(query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue

    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue

    const newFilters = queryParams.filters

    if (
      newPage === paginationState.page &&
      newOrder === paginationState.order &&
      arraysEqual(paginationState.filters, newFilters)
    ) {
      return
    }

    setPaginationState({ page: newPage, order: newOrder, filters: newFilters })

    setBlocked(true)
    updatePosts(newPage, newOrder, newFilters)
      .then(() => {
        onPaginationStateChanges && onPaginationStateChanges(newPage, newOrder, newFilters)
        setBlocked(false)
      })
  }, [query])

  const parsePosCardOptions = (
    paginatedPostCardGalleryPostCardOptions: PaginatedPostCardGalleryConfiguration[]
  ): PostCardOptionConfiguration[] => {
    return paginatedPostCardGalleryPostCardOptions.map((postCardOption) => {
      if (postCardOption.type === 'deleteSavedPost') {
        return {
          type: 'deleteSavedPost',
          ownerId: postCardOption.ownerId,
          onDelete: (postId) => postCardOption.onDelete(posts, postId, setPosts),
        }
      }

      return postCardOption
    })
  }

  const onClickSortingMenu = async (option: PaginationSortingType) => {
    if (!linkMode) {
      setPaginationState({ ...paginationState, order: option as PostsPaginationSortingType, page: 1 })

      await updatePosts(1, option as PostsPaginationSortingType, filters)
    } else {
      if (!linkMode.scrollOnClick) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const onPageChange = async (newPage: number) => {
    if (!linkMode) {
      setPaginationState({ ...paginationState, page: newPage })

      await updatePosts(newPage, order, filters)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (!linkMode.scrollOnClick) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ paginationState.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ postsNumber > defaultPerPage }
      linkMode={ linkMode }
      onClickOption={ onClickSortingMenu }
    />
  )

  const headerContent = (
    <CommonGalleryHeader
      title={ title }
      subtitle={ subtitle }
      loading={ loading }
      sortingMenu={ sortingMenu }
      tag={ headerTag }
      term={ term }
    />
  )

  return (
    <>
      { headerContent }
      <PostCardGallery
        posts={ posts }
        postCardOptions={ parsePosCardOptions(paginatedPostCardGalleryPostCardOptions) }
        loading={ loading }
        emptyState={ emptyState }
        showAds={ true }
      />
      <PaginationBar
        key={ asPath }
        pageNumber={ paginationState.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        linkMode={ linkMode }
        onPageChange={ onPageChange }
        disabled={ loading }
      />
    </>
  )
}
