import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ProducersPage, ProducersPageProps } from '~/components/pages/ProducersPage/ProducersPage'
import { GetProducers } from '~/modules/Producers/Application/GetProducers/GetProducers'
import { ProducerCardDtoTranslator } from '~/modules/Producers/Infrastructure/ProducerCardDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationQueryParams'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'

export const getServerSideProps: GetServerSideProps<ProducersPageProps> = async (context) => {
  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'all_producers',
    'app_menu',
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
    'producers',
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
        destination: `/${locale}/producers?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: ProducersPageProps = {
    initialProducers: [],
    initialProducersNumber: 0,
    initialPage: 1,
    initialOrder: PaginationSortingType.NAME_FIRST,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    ...i18nSSRConfig,
  }

  const getProducers = container.resolve<GetProducers>('getProducersUseCase')

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

    const actors = await getProducers.get({
      producersPerPage: defaultPerPage,
      page,
      sortCriteria,
      sortOption,
    })

    props.initialProducersNumber = actors.producersNumber
    props.initialProducers = actors.producers.map((producer) => {
      return ProducerCardDtoTranslator.fromApplicationDto(producer.producer, producer.postsNumber)
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

export default ProducersPage
