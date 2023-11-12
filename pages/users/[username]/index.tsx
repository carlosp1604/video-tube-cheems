import nextI18nextConfig from '~/next-i18next.config'
import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserProfilePage, UserProfilePageProps } from '~/components/pages/UserProfilePage/UserProfilePage'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/UserHeaderComponentDtoTranslator'
import { GetUserSavedPosts } from '~/modules/Posts/Application/GetUserSavedPosts/GetUserSavedPosts'
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
import {
  PostsPaginationOrderType,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { defaultPerPage, maxPerPage, minPerPage } from '~/modules/Shared/Infrastructure/Pagination'

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale
  let { username, section } = context.query

  if (!username) {
    return {
      notFound: true,
    }
  }

  username = username.toString()

  if (!section) {
    section = 'savedPosts'
  }

  if (section !== 'savedPosts' && section !== 'history') {
    section = 'savedPosts'
  }

  const paginationQueryParams = new PostsPaginationQueryParams(
    context.query,
    {
      filters: {
        // TODO: Decide which filter parse based on section property
        filtersToParse: [
          PostFilterOptions.SAVED_BY,
          PostFilterOptions.VIEWED_BY,
        ],
      },
      sortingOptionType: {
        defaultValue: PostsPaginationOrderType.NEWEST_SAVED,
        // TODO: Decide which filter parse based on section property
        parseableOptionTypes: [
          PostsPaginationOrderType.NEWEST_SAVED,
          PostsPaginationOrderType.OLDEST_VIEWED,
        ],
      },
      page: {
        defaultValue: 1,
        minValue: 0,
        maxValue: Infinity,
      },
      perPage: {
        defaultValue: defaultPerPage,
        maxValue: maxPerPage,
        minValue: minPerPage,
      },
    }
  )

  if (paginationQueryParams.parseFailed) {
    let stringPaginationParams = paginationQueryParams.getParsedQueryString()

    if (stringPaginationParams !== '') {
      stringPaginationParams = `&${stringPaginationParams}`
    }

    return {
      redirect: {
        destination: `/${locale}/users/${username}?section=${section}${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const props: UserProfilePageProps = {
    section: section as UserProfilePostsSectionSelectorType,
    page: paginationQueryParams.page ?? 1,
    perPage: paginationQueryParams.perPage ?? defaultPerPage,
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

    props.userComponentDto = UserHeaderComponentDtoTranslator.fromApplication(userApplicationDto)
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
        page: paginationQueryParams.page ?? 1,
        filters: [{
          type: PostFilterOptions.SAVED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: paginationQueryParams.perPage ?? defaultPerPage,
        sortCriteria: InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.SAVED_DATE,
      })

      console.log(savedPosts)

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
        page: paginationQueryParams.page ?? 1,
        filters: [{
          type: PostFilterOptions.VIEWED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: paginationQueryParams.page ?? defaultPerPage,
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
