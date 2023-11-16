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
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale
  let { username } = context.query

  if (!username) {
    return {
      notFound: true,
    }
  }

  username = username.toString()

  const props: UserProfilePageProps = {
    savedPosts: [],
    historyPosts: [],
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

  const getSavedPosts = container.resolve<GetUserSavedPosts>('getUserSavedPostsUseCase')
  const getUserHistory = container.resolve<GetUserHistory>('getUserHistoryUseCase')

  try {
    const [savedPosts, viewedPosts] = await Promise.all([
      getSavedPosts.get({
        page: 1,
        filters: [{
          type: PostFilterOptions.SAVED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: defaultPerPage,
        sortCriteria: InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.SAVED_DATE,
      }),
      getUserHistory.get({
        page: 1,
        filters: [{
          type: PostFilterOptions.VIEWED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: defaultPerPage,
        sortCriteria: InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.VIEW_DATE,
      }),
    ])

    props.savedPosts = savedPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })

    props.historyPosts = viewedPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
  } catch (exception: unknown) {
    console.error(exception)
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
