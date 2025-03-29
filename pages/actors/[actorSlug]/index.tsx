import { GetServerSideProps } from 'next'
import { GetActorBySlug } from '~/modules/Actors/Application/GetActorBySlug/GetActorBySlug'
import { ActorPageComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorPageComponentDtoTranslator'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { defaultPerPageWithoutAds } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { ActorPage, ActorPageProps } from '~/components/pages/ActorPage/ActorPage'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Settings } from 'luxon'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { i18nConfig } from '~/i18n.config'

export const getServerSideProps: GetServerSideProps<ActorPageProps> = async (context) => {
  if (!context.params) {
    return {
      notFound: true,
    }
  }

  const actorSlug = context.params.actorSlug
  const locale = context.locale ?? i18nConfig.defaultLocale

  if (!actorSlug) {
    return {
      notFound: true,
    }
  }

  if (Object.entries(context.params).length > 1) {
    return {
      redirect: {
        destination: `/${locale}/actors/${actorSlug}`,
        permanent: false,
      },
    }
  }

  const paginationQueryParams = new PostsQueryParamsParser(
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

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  let shouldIndexPage = true

  if (paginationQueryParams.getParsedQueryString() !== '') {
    shouldIndexPage = false
  }

  const htmlPageMetaContextService = new HtmlPageMetaContextService(
    context,
    { includeQuery: false, includeLocale: true },
    { index: shouldIndexPage, follow: true }
  )

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the actor page')
  } else {
    baseUrl = env.BASE_URL
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )

  const props: ActorPageProps = {
    actor: {
      description: null,
      slug: '',
      name: '',
      imageUrl: '',
      id: '',
      viewsCount: 0,
    },
    order: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    page: paginationQueryParams.page ?? 1,
    posts: [],
    postsNumber: 0,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
  }

  const getActor = container.resolve<GetActorBySlug>('getActorBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const actor = await getActor.get(actorSlug.toString())

    props.actor = ActorPageComponentDtoTranslator.fromApplicationDto(actor)
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

    const actorPosts = await getPosts.get({
      page,
      filters: [{ type: FilterOptions.ACTOR_SLUG, value: String(actorSlug) }],
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPageWithoutAds,
    })

    props.posts = actorPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = actorPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  // Experimental: Try to improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  return {
    props,
  }
}

export default ActorPage
