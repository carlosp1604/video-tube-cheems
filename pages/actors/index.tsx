import { GetServerSideProps } from 'next'
import { ActorsPageProps, ActorsPage } from '~/components/pages/ActorsPage/ActorsPage'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { ActorComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorComponentDtoTranslator'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async (context) => {
  const getActors = container.resolve<GetActors>('getActors')

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'all_producers',
    'app_menu',
    'menu_options',
    'sorting_menu_dropdown',
    'user_menu',
    'carousel',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'common',
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

    props.actors = actors.actors.map((actor) => ActorComponentDtoTranslator.fromApplicationDto(actor))
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
