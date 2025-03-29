import { GetServerSideProps } from 'next'
import { SearchPage, SearchPageProps } from '~/components/pages/SearchPage/SearchPage'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import DOMPurify from 'isomorphic-dompurify'
import { QueryParamsParserConfiguration } from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { i18nConfig } from '~/i18n.config'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const search = context.query.search

  if (!search) {
    return {
      notFound: true,
    }
  }

  const cleanSearchTerm = DOMPurify.sanitize(search.toLocaleString())

  if (cleanSearchTerm === '') {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? i18nConfig.defaultLocale

  const configuration:
    Omit<QueryParamsParserConfiguration<PostFilterOptions, PostsPaginationSortingType>, 'filters' | 'perPage'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: [
          PaginationSortingType.LATEST,
          PaginationSortingType.OLDEST,
          PaginationSortingType.MOST_VIEWED,
        ],
      },
    }

  const paginationQueryParams = new PostsQueryParamsParser(context.query, configuration)

  if (paginationQueryParams.parseFailed) {
    const query = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/posts/search?search=${search}${query !== '' ? `&${query}` : ''}`,
        permanent: false,
      },
    }
  }

  let localizedUrl = context.resolvedUrl

  if (locale !== i18nConfig.defaultLocale) {
    localizedUrl = `/${locale}${localizedUrl}`
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: true, includeLocale: true },
    { index: false, follow: true }
  )

  const props: SearchPageProps = {
    initialSearchTerm: DOMPurify.sanitize(search.toLocaleString()),
    initialSortingOption: paginationQueryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
    initialPage: paginationQueryParams.page ?? configuration.page.defaultValue,
    posts: [],
    postsNumber: 0,
    asPath: localizedUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

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

    const posts = await getPosts.get({
      page,
      filters: [{ type: FilterOptions.POST_TITLE, value: cleanSearchTerm }],
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPage,
    })

    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = posts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=1'
  )

  return {
    props,
  }
}

export default SearchPage
