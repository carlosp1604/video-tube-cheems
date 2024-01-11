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
import { useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'

interface PaginationState {
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

  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: initialPage, order: initialSortingOption, searchTerm: initialSearchTerm,
  })

  const [loading, setLoading] = useState<boolean>(false)

  const firstRender = useFirstRender()
  const { t } = useTranslation('search')
  const { setBlocked } = useUsingRouterContext()
  const router = useRouter()
  const query = router.query
  const locale = router.locale ?? 'en'

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: false,
    scrollOnClick: false,
  }

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      sortingOptionType: {
        defaultValue: PostsPaginationSortingType.LATEST,
        parseableOptionTypes: [
          PostsPaginationSortingType.LATEST,
          PostsPaginationSortingType.OLDEST,
          PostsPaginationSortingType.MOST_VIEWED,
        ],
      },
    }

  const fetchPosts = (
    page: number,
    orderCriteria: InfrastructureSortingCriteria,
    orderOption: InfrastructureSortingOptions,
    title: string
  ) => {
    return (new PostsApiService())
      .getPosts(
        page,
        defaultPerPage,
        orderCriteria,
        orderOption,
        [{ type: PostFilterOptions.POST_TITLE, value: title }]
      )
  }

  const updatePosts = async (
    page:number,
    order: PostsPaginationSortingType,
    title: string
  ) => {
    const componentOrder = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(order)

    try {
      const newPosts = await fetchPosts(page, componentOrder.criteria, componentOrder.option, title)

      setPostsNumber(newPosts.postsNumber)
      setPosts(newPosts.posts.map((post) => {
        return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
      }))
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  useEffect(() => {
    if (firstRender) {
      setLoading(true)
      setBlocked(true)
      updatePosts(paginationState.page, paginationState.order, paginationState.searchTerm)
        .then(() => {
          setLoading(false)
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

    setLoading(true)
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
      setLoading(false)
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
    </span>)

  return (
    <div className={ styles.searchPage__container }>
      <PostCardGalleryHeader
        key={ router.asPath }
        title={ titleElement }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        showSortingOptions={ postsNumber > defaultPerPage }
        activeOption={ paginationState.order }
        sortingOptions={ [
          PostsPaginationSortingType.LATEST,
          PostsPaginationSortingType.OLDEST,
          PostsPaginationSortingType.MOST_VIEWED,
        ] }
        loading={ loading }
        linkMode={ linkMode }
        onClickOption={ () => window.scrollTo({ top: 0 }) }
      />

      { postsNumber === 0 && !loading
        ? <EmptyState
          title={ t('post_gallery_empty_state_title') }
          subtitle={ t('post_gallery_empty_state_subtitle', { searchTerm: paginationState.searchTerm }) }
        />
        : <PostCardGallery
          posts={ posts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          loading={ loading }
        />
      }
      { firstRender
        ? null
        : <PaginationBar
          availablePages={ PaginationHelper.getShowablePages(
            paginationState.page, PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage)) }
          pageNumber={ paginationState.page }
          pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
          onePageStateTitle={ postsNumber > 0 ? t('one_page_state_title') : undefined }
          disabled={ loading }
          linkMode={ linkMode }
          onPageChange={ () => window.scrollTo({ top: 0 }) }
        />
      }
    </div>
  )
}
