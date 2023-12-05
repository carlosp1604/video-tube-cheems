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

export interface SearchPageProps {
  initialTitle: string
  initialPage: number
  initialSortingOption: PostsPaginationSortingType
}

export const SearchPage: NextPage<SearchPageProps> = ({
  initialTitle,
  initialPage,
  initialSortingOption,
}) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>([])
  const [postsNumber, setPostsNumber] = useState<number>(0)
  const [order, setOrder] = useState<PostsPaginationSortingType>(initialSortingOption)
  const [page, setPage] = useState<number>(initialPage)
  const [title, setTitle] = useState<string>(initialTitle)
  const [loading, setLoading] = useState<boolean>(false)

  const firstRender = useFirstRender()
  const { t } = useTranslation('search')
  const router = useRouter()
  const query = router.query
  const locale = router.locale ?? 'en'

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
      updatePosts(page, order, title)
        .then(() => setLoading(false))
    }

    const queryParams = new PostsPaginationQueryParams(query, configuration)

    let currentTitle = title

    if (query.search && !Array.isArray(query.search)) {
      currentTitle = String(query.search)
    } else {
      // TODO: Error message and return -> no action take
      return
    }

    setLoading(true)
    updatePosts(
      queryParams.page ?? configuration.page.defaultValue,
      queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
      currentTitle
    )
      .then(() => {
        setPage(queryParams.page ?? configuration.page.defaultValue)
        setOrder(queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue)
        setTitle(currentTitle)
        setLoading(false)
      })
  }, [query])

  const onChangeOption = async (newOrder: PostsPaginationSortingType) => {
    /** When change sorting option we move to page 1 **/
    const newQuery = PostsPaginationQueryParams.buildQuery(
      String(configuration.page.defaultValue),
      String(configuration.page.defaultValue),
      newOrder,
      configuration.sortingOptionType.defaultValue,
      []
    )

    await router.push({
      query: {
        ...newQuery,
        search: title,
      },
    }, undefined, { shallow: true, scroll: false })
  }

  const onPageChange = async (newPage: number) => {
    /** When change sorting option we move to page 1 **/
    const newQuery = PostsPaginationQueryParams.buildQuery(
      String(newPage),
      String(configuration.page.defaultValue),
      order,
      configuration.sortingOptionType.defaultValue,
      []
    )

    await router.push({
      query: {
        ...newQuery,
        search: title,
      },
    }, undefined, { shallow: true, scroll: false })
  }

  const titleElement = (
    <span className={ styles.searchPage__searchTermTitle }>
      <Trans
        i18nKey={ t('search_result_title') }
        components={ [<div key={ 'search_result_title' } className={ styles.searchPage__searchTermTitleTerm }/>] }
        values={ { searchTerm: title } }
      />
    </span>)

  return (
    <div className={ styles.searchPage__container }>
      <PostCardGalleryHeader
        key={ router.asPath }
        title={ titleElement }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        showSortingOptions={ postsNumber > defaultPerPage }
        activeOption={ order }
        sortingOptions={ [
          PostsPaginationSortingType.LATEST,
          PostsPaginationSortingType.OLDEST,
          PostsPaginationSortingType.MOST_VIEWED,
        ] }
        onChangeOption={ onChangeOption }
        loading={ loading }
      />

      { postsNumber === 0 && !loading
        ? <EmptyState
          title={ t('post_gallery_empty_state_title') }
          subtitle={ t('post_gallery_empty_state_subtitle', { searchTerm: title }) }
        />
        : <PostCardGallery
          posts={ posts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          loading={ loading }
        />
      }
      <PaginationBar
        availablePages={ PaginationHelper.getShowablePages(
          page, PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage)) }
        onPageNumberChange={ onPageChange }
        pageNumber={ page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        onePageStateTitle={ postsNumber > 0 ? t('one_page_state_title') : undefined }
      />
    </div>
  )
}
