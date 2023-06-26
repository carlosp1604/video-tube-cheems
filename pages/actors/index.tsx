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

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async () => {
  const props: ActorsPageProps = {
    actors: [],
    actorsNumber: 0,
  }

  const getActors = container.resolve<GetActors>('getActors')

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
