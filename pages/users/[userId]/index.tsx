import { GetServerSideProps, NextPage } from 'next'
import nextI18nextConfig from '~/next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale ? context.locale : nextI18nextConfig.i18n.defaultLocale

  return {
    props: {
      ...await serverSideTranslations(locale, [
        'user_menu', 'user_profile',
      ]),
    },
  }
}

const UserProfilePage: NextPage = () => {
  return (
    <UserProfileHeader
      email={ 'asd' }
      id={ 'asd' }
      name={ 'Carlos Pontón' }
      createdAt={ '15 de Septiembre de 2023' }
      imageUrl={ null }
      username={ 'carlos_ponton16' }
    />
  )
}

export default UserProfilePage
