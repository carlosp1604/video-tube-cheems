import nextI18nextConfig from '~/next-i18next.config'
import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserProfilePageProps, UserProfilePage } from '~/components/pages/UserProfilePage/UserProfilePage'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/UserHeaderComponentDtoTranslator'
import { GetUserSavedPosts } from '~/modules/Posts/Application/GetUserSavedPosts/GetUserSavedPosts'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { GetUserHistory } from '~/modules/Posts/Application/GetUserHistory/GetUserHistory'
import {
  UserProfilePostsSectionSelectorType
} from '~/components/pages/UserProfilePage/UserProfilePostsSectionSelector/UserProfilePostsSectionSelector'

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale
  let { username, section, perPage, page, order, orderBy } = context.query

  if (!username) {
    return {
      notFound: true,
    }
  }

  let paramsError = false

  const parseNumber = (value: string): number | null => {
    if (isNaN(Number(value))) {
      return null
    }

    return parseInt(value)
  }

  username = username.toString()

  if (!section) {
    section = 'savedPosts'
  }

  if (section !== 'savedPosts' && section !== 'history') {
    section = 'savedPosts'
    paramsError = true
  }

  let parsedPerPage = defaultPerPage
  let parsedPage = 1
  let parsedOrder = 'desc'
  const parsedOrderBy = 'sv'

  if (perPage) {
    const parsedNumber = parseNumber(String(perPage))

    if (parsedNumber !== null && (parsedNumber > 10 && parsedNumber < 256)) {
      parsedPerPage = parsedNumber
    } else {
      paramsError = true
    }
  }

  if (page) {
    const parsedNumber = parseNumber(String(page))

    if (parsedNumber !== null && parsedNumber >= 1) {
      parsedPage = parsedNumber
    } else {
      paramsError = true
    }
  }

  if (order) {
    if (order !== 'asc' && order !== 'desc') {
      paramsError = true
    } else {
      parsedOrder = String(order)
    }
  }

  if (paramsError) {
    return {
      redirect: {
        destination: `/${locale}/users/${username}?section=${section}&page=${parsedPage}&perPage=${parsedPerPage}`,
        permanent: false,
      },
    }
  }

  const props: UserProfilePageProps = {
    section: section as UserProfilePostsSectionSelectorType,
    page: parsedPage,
    perPage: parsedPerPage,
    posts: [],
    postsNumber: 0,
    userComponentDto: {
      createdAt: '',
      email: '',
      id: '',
      name: '',
      imageUrl: '',
      username: '',
    },
  }

  const getUser = container.resolve<GetUserByUsername>('getUserByUsername')

  try {
    const userApplicationDto = await getUser.get(username)

    const userHeaderComponentDto = UserHeaderComponentDtoTranslator.fromApplication(userApplicationDto)

    props.userComponentDto = userHeaderComponentDto
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

  if (section === 'savedPosts') {
    const getSavedPosts = container.resolve<GetUserSavedPosts>('getUserSavedPostsUseCase')

    try {
      const savedPosts = await getSavedPosts.get({
        page: parsedPage,
        filters: [{
          type: PostFilterOptions.SAVED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: parsedPerPage,
        sortCriteria: InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.SAVED_DATE,
      })

      props.posts = savedPosts.posts.map((post) => {
        return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
      })
      props.postsNumber = savedPosts.postsNumber
    } catch (exception: unknown) {
      console.error(exception)
    }
  } else {
    try {
      const getUserHistory = container.resolve<GetUserHistory>('getUserHistoryUseCase')

      const viewedPosts = await getUserHistory.get({
        page: parsedPage,
        filters: [{
          type: PostFilterOptions.VIEWED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: parsedPerPage,
        sortCriteria: InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.VIEW_DATE,
      })

      props.posts = viewedPosts.posts.map((post) => {
        return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
      })
      props.postsNumber = viewedPosts.postsNumber
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  return {
    props: {
      ...props,
      ...await serverSideTranslations(locale, [
        'user_menu',
        'user_profile',
        'app_menu',
        'menu',
        'sorting_menu_dropdown',
        'user_menu',
        'user_signup',
        'user_login',
        'user_retrieve_password',
        'post_card',
        'pagination_bar',
        'common',
        'paginated_post_card_gallery',
      ]),
    },
  }
}

export default UserProfilePage
