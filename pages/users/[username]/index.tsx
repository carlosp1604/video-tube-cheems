import nextI18nextConfig from '~/next-i18next.config'
import { container } from '~/awailix.container'
import { GetUserByUsername } from '~/modules/Auth/Application/GetUser/GetUserByUsername'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps, NextPage } from 'next'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import {
  UserHeaderComponentDtoTranslator
} from '~/modules/Auth/Infrastructure/Translators/UserHeaderComponentDtoTranslator'

interface Props {
  userComponentDto: UserProfileHeaderComponentDto
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
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

const UserProfilePage: NextPage<Props> = ({ userComponentDto }) => {
  return (
    <UserProfileHeader
      componentDto={ userComponentDto }
    />
  )
}

export default UserProfilePage
