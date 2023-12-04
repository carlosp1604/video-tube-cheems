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
import { GetUserHistory } from '~/modules/Posts/Application/GetUserHistory/GetUserHistory'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  UserProfilePostsSectionSelectorType,
  UserProfilePostsSectionSelectorTypes
} from '~/components/pages/UserProfilePage/UserProfilePostsSectionSelector/UserProfilePostsSectionSelector'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { GetPostsApplicationResponse } from '~/modules/Posts/Application/Dtos/GetPostsApplicationDto'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'

async function getPosts (
  section: string,
  paginationQueryParams: PostsPaginationQueryParams,
  userId: string
): Promise<GetPostsApplicationResponse | null> {
  const infrastructureOrder = paginationQueryParams.componentSortingOption

  if (section === 'savedPosts') {
    const getSavedPosts = container.resolve<GetUserSavedPosts>('getUserSavedPostsUseCase')

    try {
      return getSavedPosts.get({
        page: 1,
        filters: [{
          type: PostFilterOptions.SAVED_BY,
          value: userId,
        }],
        postsPerPage: defaultPerPage,
        sortCriteria: infrastructureOrder?.criteria ?? InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.SAVED_DATE,
      })
    } catch (exception: unknown) {
      console.error(exception)

      return null
    }
  } else {
    const getUserHistory = container.resolve<GetUserHistory>('getUserHistoryUseCase')

    try {
      return getUserHistory.get({
        page: 1,
        filters: [{
          type: PostFilterOptions.VIEWED_BY,
          value: userId,
        }],
        postsPerPage: defaultPerPage,
        sortCriteria: infrastructureOrder?.criteria ?? InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.VIEW_DATE,
      })
    } catch (exception: unknown) {
      console.error(exception)

      return null
    }
  }
}

function getQueryParamsConfiguration (
  section: string
): Partial<PostsPaginationConfiguration> & Pick<PostsPaginationConfiguration, 'sortingOptionType'> {
  if (section === 'savedPosts') {
    return {
      sortingOptionType: {
        defaultValue: PostsPaginationSortingType.NEWEST_SAVED,
        parseableOptionTypes: [
          PostsPaginationSortingType.NEWEST_SAVED,
          PostsPaginationSortingType.OLDEST_SAVED,
        ],
      },
    }
  } else {
    return {
      sortingOptionType: {
        defaultValue: PostsPaginationSortingType.NEWEST_VIEWED,
        parseableOptionTypes: [
          PostsPaginationSortingType.NEWEST_VIEWED,
          PostsPaginationSortingType.OLDEST_VIEWED,
        ],
      },
    }
  }
}

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

  const configuration = getQueryParamsConfiguration(parsedSection)

  const paginationQueryParams = new PostsPaginationQueryParams(context.query, configuration)

  username = username.toString()

  const props: UserProfilePageProps = {
    section: parsedSection,
    initialPosts: [],
    initialPostsNumber: 0,
    initialOrder: paginationQueryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue,
    initialPage: 1,
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

  const postsApplicationResponse = await getPosts(parsedSection, paginationQueryParams, props.userComponentDto.id)

  if (postsApplicationResponse) {
    props.initialPosts = postsApplicationResponse.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.initialPostsNumber = postsApplicationResponse.postsNumber
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
        'sorting_menu_dropdown',
      ]),
    },
  }
}

export default UserProfilePage
