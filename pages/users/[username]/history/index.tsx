import nextI18nextConfig from '~/next-i18next.config'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserSavedPostsPageProps } from '~/components/pages/UserSavedPostsPage/UserSavedPostsPage'
import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/UserHeaderComponentDtoTranslator'
import { UserHistoryPage, UserHistoryPageProps } from '~/components/pages/UserHistoryPage/UserHistoryPage'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getServerSideProps: GetServerSideProps<UserHistoryPageProps> = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale
  let { username } = context.query

  if (!username) {
    return {

      notFound: true,
    }
  }

  username = username.toString()

  const { env } = process

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: UserSavedPostsPageProps = {
    userComponentDto: {
      createdAt: '',
      email: '',
      id: '',
      name: '',
      imageUrl: '',
      username: '',
      formattedCreatedAt: '',
      updatedAt: '',
    },
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
  }

  const getUser = container.resolve<GetUserByUsername>('getUserByUsername')

  try {
    const userApplicationDto = await getUser.get(username)

    props.userComponentDto = UserHeaderComponentDtoTranslator.fromApplication(userApplicationDto, locale)
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...props,
      ...await serverSideTranslations(locale, [
        'user_menu',
        'user_profile',
        'app_menu',
        'app_banner',
        'footer',
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

export default UserHistoryPage
