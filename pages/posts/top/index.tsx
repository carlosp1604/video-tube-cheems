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

export const getStaticProps: GetStaticProps<TopVideoPostPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the top posts page')
  } else {
    baseUrl = env.BASE_URL
  }

  let url = `${baseUrl}/posts/top`

  if (locale !== 'en') {
    url = `${baseUrl}/${locale}/posts/top`
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService({
    ...context,
    locale,
    pathname: 'posts/top',
    req: {
      url,
    },
  })

  const props: TopVideoPostPageProps = {
    todayTopPosts: [],
    weekTopPosts: [],
    monthTopPosts: [],
    currentDay: '',
    currentMonth: '',
    currentWeek: '',
    baseUrl,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getTopVideoPosts = container.resolve<GetTopVideoPosts>('getTopVideoPostsUseCase')

  const nowDate = new Date()

  const dateService = container.resolve<DateServiceInterface>('dateService')

  const todayDate = dateService.getCurrentDayWithoutTime()
  const currentWeekMonday = dateService.getCurrentWeekFirstDay()
  const currentMonthFirstDay = dateService.getCurrentMonthFirstDay()

  const todayDateString = DateTime.fromJSDate(todayDate).toLocaleString({ month: 'long', day: '2-digit' })
  const currentWeekMondayString =
    DateTime.fromJSDate(currentWeekMonday).toLocaleString({ month: 'long', day: '2-digit' })
  const currentMonthFirstDayString =
    DateTime.fromJSDate(currentMonthFirstDay).toLocaleString({ month: 'long', day: '2-digit' })

  props.currentDay = DateTime.fromJSDate(todayDate).toLocaleString({ month: 'long', day: '2-digit' })
  props.currentWeek = `${currentWeekMondayString} - ${todayDateString}`
  props.currentMonth = `${currentMonthFirstDayString} - ${todayDateString}`

  try {
    const [
      todayTopPosts,
      weekTopPosts,
      monthTopPosts,
    ] = await Promise.all([
      await getTopVideoPosts.get({ startDate: todayDate, endDate: nowDate }),
      await getTopVideoPosts.get({ startDate: currentWeekMonday, endDate: nowDate }),
      await getTopVideoPosts.get({ startDate: currentMonthFirstDay, endDate: nowDate }),
    ])

    props.todayTopPosts =
      todayTopPosts.map((postApplicationDto) =>
        PostCardComponentDtoTranslator.fromApplication(postApplicationDto.post, postApplicationDto.postViews, locale))

    props.weekTopPosts =
      weekTopPosts.map((postApplicationDto) =>
        PostCardComponentDtoTranslator.fromApplication(postApplicationDto.post, postApplicationDto.postViews, locale))

    props.monthTopPosts =
      monthTopPosts.map((postApplicationDto) =>
        PostCardComponentDtoTranslator.fromApplication(postApplicationDto.post, postApplicationDto.postViews, locale))

    return {
      props,
      revalidate: 900, // Try to regenerate page each 15 minutes
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default TopVideoPostsPage
