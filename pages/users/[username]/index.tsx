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
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { GetUserHistory } from '~/modules/Posts/Application/GetUserHistory/GetUserHistory'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  UserProfilePostsSectionSelectorType, UserProfilePostsSectionSelectorTypes
} from '~/components/pages/UserProfilePage/UserProfilePostsSectionSelector/UserProfilePostsSectionSelector'

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale
  let { username, section } = context.query

  if (!username) {
    return {
      notFound: true,
    }
  }

  let parsedSection: UserProfilePostsSectionSelectorType = 'savedPosts'

  if (section) {
    if (UserProfilePostsSectionSelectorTypes.includes(section as UserProfilePostsSectionSelectorType)) {
      parsedSection = section as UserProfilePostsSectionSelectorType
    } else {
      return {
        redirect: {
          destination: `/${locale}/users/${username}?section=savedPosts`,
          permanent: false,
        },
      }
    }
  }

  username = username.toString()

  const props: UserProfilePageProps = {
    section: parsedSection,
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

  if (parsedSection === 'savedPosts') {
    const getSavedPosts = container.resolve<GetUserSavedPosts>('getUserSavedPostsUseCase')

    try {
      const savedPosts = await getSavedPosts.get({
        page: 1,
        filters: [{
          type: PostFilterOptions.SAVED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: defaultPerPage,
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
    const getUserHistory = container.resolve<GetUserHistory>('getUserHistoryUseCase')

    try {
      const viewedPosts = await getUserHistory.get({
        page: 1,
        filters: [{
          type: PostFilterOptions.VIEWED_BY,
          value: props.userComponentDto.id,
        }],
        postsPerPage: defaultPerPage,
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
        'user_menu',
        'user_signup',
        'user_login',
        'user_retrieve_password',
        'post_card',
        'common',
        'api_exceptions',
        'post_card_options',
        'post_card_gallery',
        'carousel',
      ]),
    },
  }
}

export default UserProfilePage
