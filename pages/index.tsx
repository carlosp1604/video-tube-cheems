import { GetServerSideProps, NextPage } from 'next'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { GetAllProducers } from '~/modules/Producers/Application/GetAllProducers'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  ProducerListComponentDtoTranslator
} from '~/modules/Producers/Infrastructure/Translators/ProducerListComponentDtoTranslator'
import { PostCardComponentDtoTranslator } from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  PaginatedPostCardGallery
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { container } from '~/awilix.container'
import {
  HomePostsDefaultSortingOption,
  HomePostsSortingOptions,
  SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import {
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { useQueryState } from 'next-usequerystate'
import { parseAsInteger } from 'next-usequerystate/parsers'
import { GalleryActionType, useGalleryAction } from '~/hooks/GalleryAction'

interface Props {
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  postsNumber: number
}

// TODO:
// producer=producer&order=asc/desc&orderBy=date/views&page=1
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')
  const getProducers = container.resolve<GetAllProducers>('getAllProducers')

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
    'paginated_post_card_gallery',
    'api_exceptions',
  ])

  const props: Props = {
    posts: [],
    producers: [],
    postsNumber: 0,
    ...i18nSSRConfig,
  }

  try {
    const posts = await getPosts.get({
      page: 1,
      filters: [],
      sortCriteria: InfrastructureSortingCriteria.DESC,
      sortOption: InfrastructureSortingOptions.DATE,
      postsPerPage: defaultPerPage,
    })

    const producers = await getProducers.get()
    const producerComponents = producers.map((producer) => {
      return ProducerListComponentDtoTranslator.fromApplication(producer)
    })

    // Add default producer
    producerComponents.unshift(allPostsProducerDto)

    props.posts = posts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.postsNumber = posts.postsNumber
    props.producers = producerComponents
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

const HomePage: NextPage<Props> = ({ postsNumber, posts, producers }) => {
  const [activeProducer, setActiveProducer] = useState<ProducerComponentDto>(allPostsProducerDto)
  const { t } = useTranslation(['home_page', 'api_exceptions'])
  const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  const getOptions = useGalleryAction()

  const options: PostCardGalleryOption[] = getOptions(GalleryActionType.HOME_PAGE)

  const fetchPosts = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getPosts(
        pageNumber,
        defaultPerPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        setActiveProducer={ setActiveProducer }
        activeProducer={ activeProducer }
      />

      <PaginatedPostCardGallery
        perPage={ defaultPerPage }
        initialPage={ pageQueryParam }
        title={ activeProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : activeProducer.name }
        initialPosts={ posts }
        initialPostsNumber={ postsNumber }
        filters={ [{
          type: PostFilterOptions.PRODUCER_ID,
          value: activeProducer.id === '' ? null : activeProducer.id,
        }] }
        sortingOptions={ HomePostsSortingOptions }
        defaultSortingOption={ HomePostsDefaultSortingOption }
        postCardOptions={ options }
        fetchPosts={ fetchPosts }
        emptyState={ null }
      />
    </div>
  )
}

export default HomePage
