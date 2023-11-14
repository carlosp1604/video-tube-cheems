import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { useRouter } from 'next/router'
import { container } from '~/awilix.container'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { useQueryState } from 'next-usequerystate'
import { useFirstRender } from '~/hooks/FirstRender'
import { useUpdateQuery } from '~/hooks/UpdateQuery'
import { useTranslation } from 'next-i18next'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useRef, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { parseAsInteger, parseAsString } from 'next-usequerystate/parsers'
import { GalleryActionType, useGalleryAction } from '~/hooks/GalleryAction'
import {
  ProducerListComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/ProducerListComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  calculatePagesNumber, defaultPerPage, maxPerPage, minPerPage
} from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import {
  PostCardGallery,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import {
  HomePagePaginationOrderType,
  PostsPaginationOrderType,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'

interface Props {
  page: number
  perPage: number
  order: PostsPaginationOrderType
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  postsNumber: number
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'home_page',
    'app_menu',
    'menu',
    'sorting_menu_dropdown',
    'user_menu',
    'carousel',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'common',
    'paginated_post_card_gallery',
    'api_exceptions',
  ])

  const paginationQueryParams = new PostsPaginationQueryParams(
    context.query,
    {
      filters: {
        filtersToParse: [
          PostFilterOptions.PRODUCER_ID,
        ],
      },
      sortingOptionType: {
        defaultValue: PostsPaginationOrderType.NEWEST,
        parseableOptionTypes: [
          PostsPaginationOrderType.NEWEST,
          PostsPaginationOrderType.OLDEST,
          PostsPaginationOrderType.MORE_VIEWS,
        ],
      },
      page: {
        defaultValue: 1,
        minValue: 1,
        maxValue: Infinity,
      },
      perPage: {
        defaultValue: defaultPerPage,
        maxValue: maxPerPage,
        minValue: minPerPage,
      },
    }
  )

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const props: Props = {
    order: paginationQueryParams.sortingOptionType ?? PostsPaginationOrderType.NEWEST,
    page: paginationQueryParams.page ?? 1,
    perPage: paginationQueryParams.perPage ?? defaultPerPage,
    posts: [],
    producers: [],
    postsNumber: 0,
    ...i18nSSRConfig,
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

  try {
    let sortCriteria: InfrastructureSortingCriteria = InfrastructureSortingCriteria.DESC
    let sortOption: InfrastructureSortingOptions = InfrastructureSortingOptions.DATE
    let page = 1
    let perPage = defaultPerPage

    if (paginationQueryParams.componentSortingOption) {
      sortOption = paginationQueryParams.componentSortingOption.option
      sortCriteria = paginationQueryParams.componentSortingOption.criteria
    }

    if (paginationQueryParams.page) {
      page = paginationQueryParams.page
    }

    if (paginationQueryParams.perPage) {
      perPage = paginationQueryParams.perPage
    }

    const posts = await getPosts.get({
      page,
      filters: [],
      sortCriteria,
      sortOption,
      postsPerPage: perPage,
    })

    const producers = await getProducers.get()
    const producerComponents = producers.map((producer) => {
      return ProducerListComponentDtoTranslator.fromApplication(producer)
    })

    // Add default producer
    producerComponents.unshift(allPostsProducerDto)

    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = posts.postsNumber
    props.producers = producerComponents
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

const HomePage: NextPage<Props> = ({
  postsNumber,
  posts,
  producers,
  perPage,
  page,
  order,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(page)
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(postsNumber, perPage))
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(posts)
  const [currentPostsNumber, setCurrentPostsNumber] = useState<number>(postsNumber)
  const [activeSortingOption, setActiveSortingOption] = useState<PostsPaginationOrderType>(order)
  const [activeProducer, setActiveProducer] = useState<ProducerComponentDto>(allPostsProducerDto)
  const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  const [orderQueryParam] = useQueryState('order', parseAsString.withDefault(PostsPaginationOrderType.NEWEST))
  const [currentFilters, setCurrentFilters] =
    useState<FetchPostsFilter[]>(
      allPostsProducerDto.id !== ''
        ? [{ value: allPostsProducerDto.id, type: PostFilterOptions.PRODUCER_ID }]
        : []
    )

  const postGalleryRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation(['home_page', 'api_exceptions'])
  const { query, asPath, locale } = useRouter()

  const firstRender = useFirstRender()
  const updateQuery = useUpdateQuery()
  const getOptions = useGalleryAction()

  const postCardOptions: PostCardGalleryOption[] = getOptions(GalleryActionType.HOME_PAGE)
  const scrollToTop = () => { postGalleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  const onDeletePost = async (postId: string) => {
    const newPostsNumber = postsNumber - 1

    setCurrentPosts(currentPosts.filter((post) => post.id !== postId))
    setCurrentPostsNumber(currentPostsNumber - 1)

    if (currentPage > 1 && newPostsNumber % perPage === 0) {
      const newPageNumber = -1

      await updatePosts(newPageNumber, activeSortingOption, [])

      setCurrentPage(newPageNumber)
      setPagesNumber(pagesNumber - 1)
      await updateQuery([{ key: 'page', value: String(newPageNumber) }])
    }
  }

  const updatePosts = async (page: number, order: PostsPaginationOrderType, filters: FetchPostsFilter[]) => {
    const componentSortingOption =
      PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(order as PostsPaginationOrderType)

    const newPosts = await (new PostsApiService())
      .getPosts(page, defaultPerPage, componentSortingOption.criteria, componentSortingOption.option, filters)

    setCurrentPosts(newPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
    }))
    setCurrentPostsNumber(newPosts.postsNumber)
    setPagesNumber(calculatePagesNumber(newPosts.postsNumber, defaultPerPage))
  }

  useEffect(() => {
    if (firstRender) { return }

    if (
      pageQueryParam !== currentPage ||
      orderQueryParam !== activeSortingOption
    ) {
      // TODO: Add filters
      updatePosts(pageQueryParam, orderQueryParam as PostsPaginationOrderType, currentFilters)
        .then(() => {
          setCurrentPage(pageQueryParam)
          setActiveSortingOption(orderQueryParam as PostsPaginationOrderType)
        })
    }
  }, [query])

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        onChangeProducer={ async (producer) => {
          setActiveProducer(producer)

          if (producer.id === '') {
            setCurrentFilters([])
            await updatePosts(1, activeSortingOption, [])
          } else {
            console.log(activeProducer)
            await updatePosts(1, activeSortingOption, [{ value: producer.id, type: PostFilterOptions.PRODUCER_ID }])
            setCurrentFilters([{ value: producer.id, type: PostFilterOptions.PRODUCER_ID }])
            setCurrentPage(1)

            await updateQuery([
              { key: 'producerId', value: String(producer.id) },
              { key: 'page', value: '1' },
            ])
          }
        } }
        activeProducer={ activeProducer }
      />

      <div ref={ postGalleryRef }>
        <PostCardGalleryHeader
          title={ activeProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : activeProducer.name }
          postsNumber={ currentPostsNumber }
          showSortingOptions={ postsNumber > perPage }
          activeOption={ activeSortingOption }
          sortingOptions={ HomePagePaginationOrderType }
          onChangeOption={ async (option: PostsPaginationOrderType) => {
            await updatePosts(1, option, currentFilters)
            setActiveSortingOption(option)
            setCurrentPage(1)
            scrollToTop()

            await updateQuery([
              { key: 'order', value: String(option) },
              { key: 'page', value: '1' },
            ])
          } }
        />

        <PostCardGallery
          posts={ currentPosts }
          postCardOptions={ postCardOptions }
          onClickDeleteOption={ onDeletePost }
        />

        <PaginationBar
          availablePages={ PaginationHelper.getShowablePages(currentPage, pagesNumber) }
          pageNumber={ currentPage }
          onPageNumberChange={ async (newPageNumber) => {
            await updatePosts(newPageNumber, activeSortingOption, currentFilters)
            setCurrentPage(newPageNumber)
            scrollToTop()

            await updateQuery([{ key: 'page', value: String(newPageNumber) }])
          } }
          pagesNumber={ pagesNumber }
        />
      </div>
    </div>
  )
}

export default HomePage
