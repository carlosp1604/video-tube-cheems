import { NextPage } from 'next'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import styles from './SearchPage.module.scss'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { Trans, useTranslation } from 'next-i18next'
import { ReactElement, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { useGetPosts } from '~/hooks/GetPosts'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'

interface SearchPagePaginationState {
  page: number
  order: PostsPaginationSortingType
  searchTerm: string
}

export interface SearchPageProps {
  initialSearchTerm: string
  initialPage: number
  initialSortingOption: PostsPaginationSortingType
}

export const SearchPage: NextPage<SearchPageProps> = ({
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
    PostsPaginationSortingType.LATEST,
    PostsPaginationSortingType.OLDEST,
    PostsPaginationSortingType.MOST_VIEWED,
  ]

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      sortingOptionType: {
        defaultValue: PostsPaginationSortingType.LATEST,
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

  const titleElement = (
    <span className={ styles.searchPage__searchTermTitle }>
      <Trans
        i18nKey={ t('search_result_title') }
        components={ [<div key={ 'search_result_title' } className={ styles.searchPage__searchTermTitleTerm }/>] }
        values={ { searchTerm: paginationState.searchTerm } }
      />
    </span>
  )

  let content: ReactElement

  if (postsNumber === 0 && !loading && !firstRender) {
    content = (
      <EmptyState
        title={ t('post_gallery_empty_state_title') }
        subtitle={ t('post_gallery_empty_state_subtitle', { searchTerm: paginationState.searchTerm }) }
      />
    )
  } else {
    content = (
      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        loading={ loading }
      />
    )
  }

  let paginationBar: ReactElement | null = null

  if (!firstRender) {
    paginationBar = (
      <PaginationBar
        availablePages={ PaginationHelper.getShowablePages(
          paginationState.page, PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage)) }
        pageNumber={ paginationState.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        onePageStateTitle={ postsNumber > 0 ? t('one_page_state_title') : undefined }
        disabled={ loading }
        linkMode={ linkMode }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    )
  }

  return (
    <div className={ styles.searchPage__container }>
      <PostCardGalleryHeader
        key={ router.asPath }
        title={ titleElement }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        showSortingOptions={ postsNumber > defaultPerPage }
        activeOption={ paginationState.order }
        sortingOptions={ sortingOptions }
        loading={ loading }
        linkMode={ linkMode }
        onClickOption={ () => window.scrollTo({ top: 0 }) }
      />

      { content }
      { paginationBar }
    </div>
  )
}
