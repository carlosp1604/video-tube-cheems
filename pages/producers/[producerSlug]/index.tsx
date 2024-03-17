import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { GetProducerBySlug } from '~/modules/Producers/Application/GetProducerBySlug/GetProducerBySlug'
import { ProducerPage, ProducerPageProps } from '~/components/pages/ProducerPage/ProducerPage'
import {
  ProducerPageComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/ProducerPageComponentDtoTranslator'
import { PostsPaginationQueryParams } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { getSession } from 'next-auth/react'
import { AddProducerView } from '~/modules/Producers/Application/AddProducerView/AddProducerView'

export const getServerSideProps: GetServerSideProps<ProducerPageProps> = async (context) => {
  const producerSlug = context.query.producerSlug

  if (!producerSlug) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'app_menu',
    'app_banner',
    'footer',
    'menu',
    'sorting_menu_dropdown',
    'user_menu',
    'post_card',
    'user_signup',
    'user_login',
    'user_retrieve_password',
    'pagination_bar',
    'common',
    'api_exceptions',
    'post_card_options',
    'post_card_gallery',
    'producers',
  ])

  const paginationQueryParams = new PostsPaginationQueryParams(
    context.query,
    {
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: [
          PaginationSortingType.LATEST,
          PaginationSortingType.OLDEST,
          PaginationSortingType.MOST_VIEWED,
        ],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }
  )

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/producers/${producerSlug}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the producer page')
  } else {
    baseUrl = env.BASE_URL
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: ProducerPageProps = {
    producer: {
      description: '',
      slug: '',
      name: '',
      imageUrl: '',
      id: '',
      brandHexColor: '',
    },
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    initialPage: paginationQueryParams.page ?? 1,
    initialPosts: [],
    initialPostsNumber: 0,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
    ...i18nSSRConfig,
  }

  const getProducer = container.resolve<GetProducerBySlug>('getProducerBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const addProducerView = container.resolve<AddProducerView>('addProducerViewUseCase')

  try {
    const producer = await getProducer.get(producerSlug.toString())

    props.producer = ProducerPageComponentDtoTranslator.fromApplicationDto(producer)
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

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

    const producerPosts = await getPosts.get({
      page,
      filters: [{ type: PostFilterOptions.PRODUCER_SLUG, value: String(producerSlug) }],
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPage,
    })

    // TODO: Maybe we need to move this to an endpoint so its called from client side
    const session = await getSession()
    let userId: string | null = null

    if (session) {
      userId = session.user.id
    }

    await addProducerView.add({ producerSlug: String(producerSlug), userId })

    props.initialPosts = producerPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.initialPostsNumber = producerPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

export default ProducerPage
