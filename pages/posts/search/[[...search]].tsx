import { GetServerSideProps } from 'next'
import { SearchPage, SearchPageProps } from '~/components/pages/SearchPage/SearchPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const search = context.query.search

  if (!search) {
    return {
      notFound: true,
    }
  }

  if (Array.isArray(search) && search.length > 1) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'home_page',
    'app_menu',
    'app_banner',
    'footer',
    'menu',
    'sorting_menu_dropdown',
    'user_menu',
    'carousel',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'search',
    'common',
    'api_exceptions',
    'post_card_options',
    'post_card_gallery',
  ])

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
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

  const paginationQueryParams = new PostsPaginationQueryParams(context.query, configuration)

  if (paginationQueryParams.parseFailed) {
    const query = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/posts/search?search=${search}${query !== '' ? `&${query}` : ''}`,
        permanent: false,
      },
    }
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)
  const { env } = process

  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the search page')
  } else {
    baseUrl = env.BASE_URL
  }

  return {
    props: {
      initialSearchTerm: search.toLocaleString(),
      initialSortingOption: paginationQueryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
      initialPage: paginationQueryParams.page ?? configuration.page.defaultValue,
      htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
      baseUrl,
      ...i18nSSRConfig,
    },
  }
}

export default SearchPage
