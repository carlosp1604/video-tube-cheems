import { GetServerSideProps } from 'next'
import { ActorsPage, ActorsPageProps } from '~/components/pages/ActorsPage/ActorsPage'
import { container } from '~/awilix.container'
import { GetActors } from '~/modules/Actors/Application/GetActors/GetActors'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ActorCardDtoTranslator } from '~/modules/Actors/Infrastructure/ActorCardDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { PaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationQueryParams'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getServerSideProps: GetServerSideProps<ActorsPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'all_producers',
    'app_menu',
    'app_banner',
    'footer',
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
    'actors',
  ])

  const paginationQueryParams = new PaginationQueryParams(
    context.query,
    {
      sortingOptionType: {
        defaultValue: PaginationSortingType.NAME_FIRST,
        parseableOptionTypes: [
          PaginationSortingType.NAME_FIRST,
          PaginationSortingType.NAME_LAST,
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

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: ActorsPageProps = {
    initialActors: [],
    initialActorsNumber: 0,
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.NAME_FIRST,
    initialPage: paginationQueryParams.page ?? 1,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    ...i18nSSRConfig,
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
      return ActorCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber)
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
