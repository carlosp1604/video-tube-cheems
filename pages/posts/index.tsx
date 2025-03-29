import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { container } from '~/awilix.container'
import { GetPopularProducers } from '~/modules/Producers/Application/GetPopularProducers'
import { PostsPage, Props as PostsPageProps } from '~/components/pages/PostsPage/PostsPage'
import { GetServerSideProps } from 'next'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
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
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { defaultPerPageWithoutAds } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Settings } from 'luxon'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export const getServerSideProps: GetServerSideProps<PostsPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const paginationQueryParams = new PostsQueryParamsParser(
    context.query,
    {
      filters: { filtersToParse: [FilterOptions.PRODUCER_SLUG] },
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: [
          PaginationSortingType.LATEST,
          PaginationSortingType.OLDEST,
          PaginationSortingType.MOST_VIEWED,
        ],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
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

  let shouldIndexPage = true

  if (paginationQueryParams.getParsedQueryString() !== '') {
    shouldIndexPage = false
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeLocale: true, includeQuery: false },
    { index: shouldIndexPage, follow: true }
  )

  const { env } = process

  let baseUrl = ''
  let localizedUrl = context.resolvedUrl

  if (locale !== i18nConfig.defaultLocale) {
    localizedUrl = `/${locale}${localizedUrl}`
  }

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the home page')
  } else {
    baseUrl = env.BASE_URL
  }

  const props: PostsPageProps = {
    asPath: localizedUrl,
    order: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    page: paginationQueryParams.page ?? 1,
    posts: [],
    producers: [],
    postsNumber: 0,
    activeProducer: null,
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetPopularProducers>('getPopularProducersUseCase')

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

    const producerFilter = paginationQueryParams.getFilter(FilterOptions.PRODUCER_SLUG)

    const [posts, producers] = await Promise.all([
      getPosts.get({
        page,
        filters: paginationQueryParams.filters,
        sortCriteria,
        sortOption,
        postsPerPage: defaultPerPageWithoutAds,
      }),
      await getProducers.get(producerFilter ? producerFilter.value : null),
    ])

    const producerComponents = producers.map((producer) => {
      return ProducerComponentDtoTranslator.fromApplication(producer)
    })

    // Add default producer
    producerComponents.unshift(allPostsProducerDto)

    if (producerFilter) {
      const selectedProducer = producers.find((producer) => producer.slug === producerFilter.value)

      if (selectedProducer) {
        props.activeProducer = selectedProducer
      }
    } else {
      props.activeProducer = allPostsProducerDto
    }

    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = posts.postsNumber
    props.producers = producerComponents
  } catch (exception: unknown) {
    console.error(exception)
  }

  // Experimental: Try to improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  return {
    props,
  }
}

export default PostsPage
