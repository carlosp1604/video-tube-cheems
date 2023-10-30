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
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale
  let username = context.query.username

  if (!username) {
    return {
      notFound: true,
    }
  }

  username = username.toString()

  const getUser = container.resolve<GetUserByUsername>('getUserByUsername')
  const getSavedPosts = container.resolve<GetUserSavedPosts>('getUserSavedPostsUseCase')

  try {
    const userApplicationDto = await getUser.get(username)
    const savedPosts = await getSavedPosts.get({
      page: 1,
      filters: [{
        type: PostFilterOptions.SAVED_BY,
        value: userApplicationDto.id,
      }],
      postsPerPage: defaultPerPage,
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.SAVED_DATE,
    })

    const userHeaderComponentDto = UserHeaderComponentDtoTranslator.fromApplication(userApplicationDto)

    return {
      props: {
        userComponentDto: userHeaderComponentDto,
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
        posts: savedPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
        }),
        postsNUmber: savedPosts.postsNumber,
      },
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default UserProfilePage
