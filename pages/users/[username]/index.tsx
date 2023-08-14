import nextI18nextConfig from '~/next-i18next.config'
import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserProfilePageProps, UserProfilePage } from '~/components/pages/UserProfilePage/UserProfilePage'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Translators/UserHeaderComponentDtoTranslator'

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

  try {
    const userApplicationDto = await getUser.get(username)

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
        ]),
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
