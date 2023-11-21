import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { container } from '~/awilix.container'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { HomePage, Props } from '~/components/pages/HomePage/HomePage'
import { GetServerSideProps } from 'next'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ProducerComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/ProducerComponentDtoTranslator'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PostsPaginationParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationParams'
import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationOrderType'

/**
 * Allowed routes:
 * - /latest (default)
 * - /latest/{page}
 * - /latest/{producer}
 * - /latest/{producer}/{page}
 *
 * For the rest routes, we will redirect to root /latest
 *
 */

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const locale = context.locale ?? 'en'

  const i18nSSRConfig = await serverSideTranslations(locale || 'en', [
    'home_page',
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
    'api_exceptions',
    'post_card_options',
    'post_card_gallery',
  ])

  const params = new PostsPaginationParams(context.query, {
    filterParamType: {
      optional: true,
      defaultValue: '',
    },
    sortingOptionType: {
      parseableOptionTypes: [
        PostsPaginationOrderType.LATEST,
        PostsPaginationOrderType.OLDEST,
        PostsPaginationOrderType.MOST_VIEWED,
      ],
      defaultValue: PostsPaginationOrderType.LATEST,
    },
  })

  if (params.parseFailed) {
    return {
      redirect: {
        destination: params.getParsedQuery(locale),
        permanent: false,
      },
    }
  }

  const props: Props = {
    order: PostsPaginationOrderType.LATEST,
    page: 1,
    initialPosts: [],
    producers: [],
    activeProducer: allPostsProducerDto,
    initialPostsNumber: 0,
    initialFilter: null,
    ...i18nSSRConfig,
  }

  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

  try {
    const [posts, producers] = await Promise.all([
      getPosts.get({
        page: 1,
        filters: [],
        sortCriteria: InfrastructureSortingCriteria.DESC,
        sortOption: InfrastructureSortingOptions.DATE,
        postsPerPage: defaultPerPage,
      }),
      await getProducers.get(),
    ])

    const producerComponents = producers.map((producer) => {
      return ProducerComponentDtoTranslator.fromApplication(producer)
    })

    // Add default producer
    producerComponents.unshift(allPostsProducerDto)

    props.initialPosts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.initialPostsNumber = posts.postsNumber
    props.producers = producerComponents
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

export default HomePage
