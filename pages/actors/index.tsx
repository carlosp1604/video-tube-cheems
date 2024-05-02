import { GetServerSideProps } from 'next'
import { ActorsPage, ActorsPageProps } from '~/components/pages/ActorsPage/ActorsPage'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ActorCardDtoTranslator } from '~/modules/Actors/Infrastructure/ActorCardDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Settings } from 'luxon'
import { ActorQueryParamsParser } from '~/modules/Actors/Infrastructure/Frontend/ActorQueryParamsParser'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const paginationQueryParams = new ActorQueryParamsParser(
    context.query,
    {
      filters: {
        filtersToParse: [FilterOptions.ACTOR_NAME],
      },
      sortingOptionType: {
        defaultValue: PaginationSortingType.POPULARITY,
        parseableOptionTypes: [
          PaginationSortingType.NAME_FIRST,
          PaginationSortingType.NAME_LAST,
          PaginationSortingType.POPULARITY,
          // PaginationSortingType.MORE_POSTS,
          // PaginationSortingType.LESS_POSTS,
        ],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }
  )

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/actors?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the actors page')
  } else {
    baseUrl = env.BASE_URL
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: ActorsPageProps = {
    initialActors: [],
    initialActorsNumber: 0,
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.NAME_FIRST,
    initialPage: paginationQueryParams.page ?? 1,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
  }

  const getActors = container.resolve<GetActors>('getActorsUseCase')

  try {
    let sortCriteria: InfrastructureSortingCriteria = InfrastructureSortingCriteria.DESC
    let sortOption: InfrastructureSortingOptions = InfrastructureSortingOptions.DATE
    let page = 1

    if (paginationQueryParams.componentSortingOption) {
      sortOption = paginationQueryParams.componentSortingOption.option
      sortCriteria = paginationQueryParams.componentSortingOption.criteria
    }

    if (paginationQueryParams.page) {
      page = paginationQueryParams.page
    }

    const actors = await getActors.get({
      actorsPerPage: defaultPerPage,
      page,
      sortCriteria,
      sortOption,
    })

    props.initialActorsNumber = actors.actorsNumber
    props.initialActors = actors.actors.map((actor) => {
      return ActorCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber, actor.actorViews)
    })

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
