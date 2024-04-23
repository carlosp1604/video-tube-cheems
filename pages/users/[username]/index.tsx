import { container } from '~/awilix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { GetServerSideProps } from 'next'
import { UserProfilePage, UserProfilePageProps } from '~/components/pages/UserProfilePage/UserProfilePage'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Api/Translators/UserHeaderComponentDtoTranslator'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Settings } from 'luxon'

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  const locale = context.locale ?? 'en'
  let { username } = context.query

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  if (!username) {
    return {

      notFound: true,
    }
  }

  username = username.toString()

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: UserProfilePageProps = {
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
    },
  }
}

export default UserProfilePage
