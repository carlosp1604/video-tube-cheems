import { GetServerSideProps, NextPage } from 'next'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  ProducerListComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/ProducerListComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  PaginatedPostCardGallery
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { defaultPerPage, maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { container } from '~/awilix.container'
import { ComponentSortingOption } from '~/components/SortingMenuDropdown/ComponentSortingOptions'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PostCardGalleryOption } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { GalleryActionType, useGalleryAction } from '~/hooks/GalleryAction'
import {
  HomePagePaginationOrderType,
  PostsPaginationOrderType,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { useQueryState } from 'next-usequerystate'
import { parseAsInteger, parseAsString } from 'next-usequerystate/parsers'
import { useRouter } from 'next/router'

interface Props {
  page: number
  perPage: number
  order: PostsPaginationOrderType
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  postsNumber: number
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

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
  const [activeProducer, setActiveProducer] = useState<ProducerComponentDto>(allPostsProducerDto)
  const { t } = useTranslation(['home_page', 'api_exceptions'])
  const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  const [orderQueryParam] = useQueryState('order', parseAsString.withDefault(PostsPaginationOrderType.NEWEST))

  const { asPath } = useRouter()

  const getOptions = useGalleryAction()

  const options: PostCardGalleryOption[] = getOptions(GalleryActionType.HOME_PAGE)

  const fetchPosts = async (pageNumber: number, sortingOption: ComponentSortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getPosts(
        pageNumber,
        defaultPerPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        setActiveProducer={ setActiveProducer }
        activeProducer={ activeProducer }
      />

      <PaginatedPostCardGallery
        key={ asPath }
        perPage={ perPage }
        initialPage={ pageQueryParam }
        title={ activeProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : activeProducer.name }
        initialPosts={ posts }
        initialPostsNumber={ postsNumber }
        filters={ [{
          type: PostFilterOptions.PRODUCER_ID,
          value: activeProducer.id === '' ? null : activeProducer.id,
        }] }
        sortingOptions={ HomePagePaginationOrderType }
        defaultSortingOption={ PostsPaginationOrderType.NEWEST }
        initialSortingOption={ order }
        postCardOptions={ options }
        fetchPosts={ fetchPosts }
        emptyState={ null }
      />
    </div>
  )
}

export default HomePage
