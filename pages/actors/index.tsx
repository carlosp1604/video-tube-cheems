import { GetServerSideProps } from 'next'
import { ActorsPageProps, ActorsPage } from '~/components/pages/ActorsPage/ActorsPage'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async (context) => {
  const getActors = container.resolve<GetActors>('getActorsUseCase')

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'all_producers',
    'app_menu',
    'menu',
    'sorting_menu_dropdown',
    'user_menu',
    'carousel',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'common',
    'actor_page',
  ])

  const props: ActorsPageProps = {
    actors: [],
    actorsNumber: 0,
    ...i18nSSRConfig,
  }

  try {
    const actors = await getActors.get({
      actorsPerPage: defaultPerPage,
      page: 1,
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.DATE,
      filters: [],
    })

    props.actorsNumber = actors.actorsNumber

    return {
      props,
    }
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }
}

export default ActorsPage
