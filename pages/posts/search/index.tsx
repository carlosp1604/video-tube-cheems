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

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const search = context.query.search

  if (!search) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

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
          PostCardComponentDtoTranslator.fromApplication(post.post, post.postReactions, post.postComments, locale)
        ),
        title: search.toLocaleString(),
        postsNumber: posts.postsNumber,
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
