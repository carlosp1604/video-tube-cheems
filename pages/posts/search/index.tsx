import { GetServerSideProps } from 'next'
import { SearchPage, SearchPageProps } from '~/components/pages/SearchPage/SearchPage'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { bindings } from '~/modules/Posts/Infrastructure/Bindings'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const search = context.query.search

  if (!search) {
    return {
      notFound: true,
    }
  }

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
    'search',
    'common',
    'paginated_post_card_gallery',
    'api_exceptions',
  ])

  const getPosts = bindings.get<GetPosts>('GetPosts')

  try {
    const posts = await getPosts.get({
      page: 1,
      postsPerPage: defaultPerPage,
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.DATE,
      filters: [{ type: 'postTitle', value: search.toLocaleString() }],
    })

    return {
      props: {
        posts: posts.posts.map((post) =>
          PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
        ),
        title: search.toLocaleString(),
        postsNumber: posts.postsNumber,
        ...i18nSSRConfig,
      },
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default SearchPage
