import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { container } from '~/awilix.container'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { HomePage, Props } from '~/components/pages/HomePage/HomePage'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { GetServerSideProps } from 'next'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ProducerComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/ProducerComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import {
  PostsPaginationOrderType,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'

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
    'api_exceptions',
    'post_card_options',
    'post_card_gallery',
  ])

  const paginationQueryParams = new PostsPaginationQueryParams(
    context.query,
    {
      filters: {
        filtersToParse: [
          PostFilterOptions.PRODUCER_SLUG,
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
    posts: [],
    producers: [],
    activeProducer: allPostsProducerDto,
    postsNumber: 0,
    ...i18nSSRConfig,
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

  try {
    let sortCriteria: InfrastructureSortingCriteria = InfrastructureSortingCriteria.DESC
    let sortOption: InfrastructureSortingOptions = InfrastructureSortingOptions.DATE
    let page = 1

    if (paginationQueryParams.componentSortingOption) {
      sortOption = paginationQueryParams.componentSortingOption.option
      sortCriteria = paginationQueryParams.componentSortingOption.criteria
    }

    if (paginationQueryParams.page) {
      page = paginationQueryParams.page
    }

    const [posts, producers] = await Promise.all([
      getPosts.get({
        page,
        filters: paginationQueryParams.filters,
        sortCriteria,
        sortOption,
        postsPerPage: defaultPerPage,
      }),
      await getProducers.get(),
    ])

    const producerComponents = producers.map((producer) => {
      return ProducerComponentDtoTranslator.fromApplication(producer)
    })

    // Add default producer
    producerComponents.unshift(allPostsProducerDto)

    let activeProducer

    // Set active producer
    const producerIdFilter =
      paginationQueryParams.filters.find((filter) => filter.type === PostFilterOptions.PRODUCER_SLUG)

    if (producerIdFilter) {
      const selectedProducer = producers.find((producer) => producer.id === producerIdFilter.value)

      if (selectedProducer) {
        activeProducer = selectedProducer

        props.activeProducer = activeProducer
      } else {
        props.activeProducer = null
      }
    }

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

export default HomePage
