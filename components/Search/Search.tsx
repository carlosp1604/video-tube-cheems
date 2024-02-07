import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import styles from './Search.module.scss'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useTranslation } from 'next-i18next'
import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { useGetPosts } from '~/hooks/GetPosts'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'

interface SearchPagePaginationState {
  page: number
  order: PostsPaginationSortingType
  searchTerm: string
}

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
  const [posts, setPosts] = useState<PostCardComponentDto[]>([])
  const [postsNumber, setPostsNumber] = useState<number>(0)

  const [paginationState, setPaginationState] = useState<SearchPagePaginationState>({
    page: initialPage, order: initialSortingOption, searchTerm: initialSearchTerm,
  })

  const firstRender = useFirstRender()
  const { t } = useTranslation('search')
  const { setBlocked } = useUsingRouterContext()
  const { loading, getPosts } = useGetPosts()
  const router = useRouter()
  const query = router.query
  const locale = router.locale ?? 'en'

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: false,
    scrollOnClick: false,
  }

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: sortingOptions,
      },
    }

  const updatePosts = async (page:number, order: PostsPaginationSortingType, title: string) => {
    const newPosts =
      await getPosts(page, order, [{ type: PostFilterOptions.POST_TITLE, value: title }])

    if (newPosts) {
      setPostsNumber(newPosts.postsNumber)
      setPosts(newPosts.posts.map((post) => {
        return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
      }))
    }
  }

  useEffect(() => {
    if (firstRender) {
      setBlocked(true)
      updatePosts(paginationState.page, paginationState.order, paginationState.searchTerm)
        .then(() => {
          setBlocked(false)
        })

      return
    }

    const queryParams = new PostsPaginationQueryParams(query, configuration)

    let currentTitle = paginationState.searchTerm

    if (query.search && !Array.isArray(query.search)) {
      currentTitle = String(query.search)
    } else {
      // TODO: Error message and return -> no action taken
      return
    }

    setBlocked(true)

    setPaginationState({
      page: queryParams.page ?? configuration.page.defaultValue,
      order: queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
      searchTerm: currentTitle,
    })

    updatePosts(
      queryParams.page ?? configuration.page.defaultValue,
      queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
      currentTitle
    ).then(() => {
      setBlocked(false)
    })
  }, [query])

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ paginationState.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ postsNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )

  const emptyState = (
    <EmptyState
      title={ t('post_gallery_empty_state_title') }
      subtitle={ t('post_gallery_empty_state_subtitle', { searchTerm: paginationState.searchTerm }) }
    />
  )

  return (
    <div className={ styles.search__container }>
      <CommonGalleryHeader
        title={ t('search_result_title') }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        term={ { title: 'searchTerm', value: paginationState.searchTerm } }
        loading={ firstRender || loading }
        sortingMenu={ sortingMenu }
        tag={ 'h1' }
      />

      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        loading={ loading }
        emptyState={ firstRender ? null : emptyState }
      />

      <PaginationBar
        pageNumber={ paginationState.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        onePageStateTitle={ postsNumber > 0 ? t('one_page_state_title') : undefined }
        disabled={ loading }
        linkMode={ linkMode }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    </div>
  )
}
