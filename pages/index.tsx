import { GetStaticProps } from 'next'
import { container } from '~/awilix.container'
import { Settings } from 'luxon'
import { Props as HomePageProps, HomePage } from '~/components/pages/HomePage/HomePage'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { GetTopVideoPosts } from '~/modules/Posts/Application/GetTopVideoPosts/GetTopVideoPosts'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'

export const getStaticProps: GetStaticProps<HomePageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the home page')
  } else {
    baseUrl = env.BASE_URL
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService({
    ...context,
    locale,
    resolvedUrl: '/',
  })

  const props: HomePageProps = {
    posts: [],
    trendingPosts: [],
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getTrendingPosts = container.resolve<GetTopVideoPosts>('getTopVideoPostsUseCase')

  try {
    const posts = await getPosts.get({
      page: 1,
      filters: [],
      sortCriteria: 'desc',
      sortOption: 'date',
      postsPerPage: 24,
    })
    const trendingPosts = await getTrendingPosts.get({ date: 'day', postsNumber: 24 })

    props.trendingPosts =
      trendingPosts.map((postApplicationDto) =>
        PostCardComponentDtoTranslator.fromApplication(postApplicationDto.post, postApplicationDto.postViews, locale))

    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })

    return {
      props,
      revalidate: 300, // Try to regenerate page each 5 minutes
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default HomePage
