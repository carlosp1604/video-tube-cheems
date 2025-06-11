import { GetServerSideProps } from 'next'
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
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { i18nConfig } from '~/i18n.config'
import { GetTagBySlug } from '~/modules/PostTag/Application/GetTagBySlug/GetTagBySlug'
import { TagPage, TagPageProps } from '~/components/pages/TagPage/TagPage'
import {
  TagPageComponentDtoTranslator
} from '~/modules/PostTag/Infrastructure/Translators/TagPageComponentDtoTranslator'

export const getServerSideProps: GetServerSideProps<TagPageProps> = async (context) => {
  if (!context.params) {
    return {
      notFound: true,
    }
  }

  const tagSlug = context.params.tagSlug
  const locale = context.locale ?? i18nConfig.defaultLocale

  if (!tagSlug) {
    return {
      notFound: true,
    }
  }

  if (Object.entries(context.params).length > 1) {
    return {
      redirect: {
        destination: `/${locale}/tags/${tagSlug}`,
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

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/tags/${tagSlug}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the tag page')
  } else {
    baseUrl = env.BASE_URL
  }

  const htmlPageMetaContextService =
    new HtmlPageMetaContextService(context, {
      includeQuery: true,
      includeLocale: true,
    }, {
      follow: false,
      index: false,
    })

  const props: TagPageProps = {
    tag: {
      imageUrl: null,
      slug: '',
      name: '',
      id: '',
    },
    order: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    page: paginationQueryParams.page ?? 1,
    posts: [],
    postsNumber: 0,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
  }

  const getTag = container.resolve<GetTagBySlug>('getTagBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const tag = await getTag.get(tagSlug.toString())

    props.tag = TagPageComponentDtoTranslator.fromApplicationDto(tag, locale)
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
      filters: [{ type: FilterOptions.TAG_SLUG, value: String(tagSlug) }],
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPageWithoutAds,
    })

    props.posts = producerPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = producerPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=50, stale-while-revalidate=10'
  )

  return {
    props,
  }
}

export default TagPage
