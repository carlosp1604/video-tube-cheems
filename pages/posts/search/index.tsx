import { GetServerSideProps } from 'next'
import { SearchPage, SearchPageProps } from '../../../Components/pages/SearchPage/SearchPage'
import { GetPosts } from '../../../modules/Posts/Application/GetPosts'
import { bindings } from '../../../modules/Posts/Infrastructure/Bindings'
import { PostCardComponentDtoTranslator } from '../../../modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  let search = context.query.search

  if (!search) {
    return {
      notFound: true
    }
  }

  const locale = context.locale ?? 'en'

  const getPosts = bindings.get<GetPosts>('GetPosts')

  try {
    const posts = await getPosts.get({
      page: 1,
      postsPerPage: 20,
      sortCriteria: 'desc',
      sortOption: 'date',
      filters: [
        { type: 'postTitle', value: search.toLocaleString() }
      ]
    })

    return {
      props: {
        posts: posts.posts.map((post) => 
          PostCardComponentDtoTranslator.fromApplication(post.post, post.postReactions, locale)
        ),
        title: search.toLocaleString(),
        postsNumber: posts.postsNumber,
      }
    }
  }
  catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true
    }
  }
}

export default SearchPage