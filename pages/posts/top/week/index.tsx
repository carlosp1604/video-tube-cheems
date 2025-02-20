import { GetStaticProps } from 'next'
import { container } from '~/awilix.container'
import { DateTime, Settings } from 'luxon'
import {
  Props as TopVideoPostPageProps, TopVideoPostsPage
} from '~/components/pages/TopVideoPostsPage/TopVideoPostsPage'
import { GetTopVideoPosts } from '~/modules/Posts/Application/GetTopVideoPosts/GetTopVideoPosts'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { DateServiceInterface } from '~/helpers/Domain/DateServiceInterface'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { topPostsDefaultNumber } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'

export const getStaticProps: GetStaticProps<TopVideoPostPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the week top posts page')
  } else {
    baseUrl = env.BASE_URL
  }

  const dateService = container.resolve<DateServiceInterface>('dateService')

  const todayDate = dateService.getCurrentDayWithoutTime()
  const currentWeekMonday = dateService.getCurrentWeekFirstDay()
  const resolvedUrl = '/posts/top/week'
  const todayDateString = DateTime.fromJSDate(todayDate).toLocaleString({ month: 'long', day: '2-digit' })
  const currentWeekMondayString =
    DateTime.fromJSDate(currentWeekMonday).toLocaleString({ month: 'long', day: '2-digit' })

  const currentDate = `${currentWeekMondayString} - ${todayDateString}`

  const htmlPageMetaContextService = new HtmlPageMetaContextService({
    ...context,
    locale,
    resolvedUrl,
  })

  const props: TopVideoPostPageProps = {
    posts: [],
    currentDate,
    option: 'week',
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getTopVideoPosts = container.resolve<GetTopVideoPosts>('getTopVideoPostsUseCase')

  try {
    const topPosts = await getTopVideoPosts.get({ date: 'week', postsNumber: topPostsDefaultNumber })

    props.posts =
      topPosts.map((postApplicationDto) =>
        PostCardComponentDtoTranslator.fromApplication(postApplicationDto.post, postApplicationDto.postViews, locale))

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

export default TopVideoPostsPage
