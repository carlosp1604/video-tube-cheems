import { GetServerSideProps } from 'next'
import { ActorsPage, ActorsPageProps } from '../../Components/pages/ActorsPage/ActorsPage'
import { GetActors } from '../../modules/Actors/Application/GetActors'
import { ActorComponentDtoTranslator } from '../../modules/Actors/Infrastructure/ActorComponentDtoTranslator'
import { bindings } from '../../modules/Actors/Infrastructure/Bindings'
import { SortingInfrastructureCriteria, SortingInfrastructureOptions } from '../../modules/Shared/Infrastructure/InfrastructureSorting'
import { maxPerPage } from '../../modules/Shared/Infrastructure/Pagination'

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async () => {
  const props: ActorsPageProps = {
    actors: [],
    actorsNumber: 0
  }

  const getActors = bindings.get<GetActors>('GetActors')

  try {
    const actors = await getActors.get({
      actorsPerPage: maxPerPage,
      page: 1,
      sortCriteria: SortingInfrastructureCriteria.desc,
      sortOption: SortingInfrastructureOptions.date,
      filters: []
    })

    props.actors = actors.actors.map((actor) => ActorComponentDtoTranslator.fromApplicationDto(actor)),
    props.actorsNumber = actors.actorsNumber

    return {
      props
    }
  }
  catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true
    }
  }
}

export default ActorsPage