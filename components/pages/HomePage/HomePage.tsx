import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import {
  GalleryHeader
} from '~/components/GalleryHeader/GalleryHeader'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { ReactElement, useEffect, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  PostsPaginationConfiguration,
  PostsPaginationQueryParams
} from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationQueryParams'
import { useGetPosts } from '~/hooks/GetPosts'
import { useFirstRender } from '~/hooks/FirstRender'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'

export interface HomePagePaginationState {
  page: number
  order: PostsPaginationSortingType
  activeProducer: ProducerComponentDto | null
}

export interface Props {
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
}

export const HomePage: NextPage<Props> = ({
  initialPostsNumber,
  initialPosts,
  producers,
  page,
  order,
  activeProducer,
}) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const { t } = useTranslation(['home_page'])
  const router = useRouter()
  const { query } = router
  const locale = router.locale ?? 'en'
  const { getPosts, loading } = useGetPosts()
  const firstRender = useFirstRender()

  const [paginationState, setPaginationState] = useState<HomePagePaginationState>({ page, order, activeProducer })

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: true,
  }

  const configuration: Partial<PostsPaginationConfiguration> &
    Pick<PostsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      page: {
        defaultValue: 1,
        maxValue: Infinity,
        minValue: 1,
      },
      filters: { filtersToParse: [PostFilterOptions.PRODUCER_SLUG] },
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: sortingOptions,
      },
    }

  const updatePosts = async (page:number, order: PostsPaginationSortingType, producer: ProducerComponentDto | null) => {
    let filters: FetchPostsFilter[] = []

    if (!producer) {
      setPostsNumber(0)
      setPosts([])

      return
    }

    if (producer !== allPostsProducerDto) {
      filters = [{ type: PostFilterOptions.PRODUCER_SLUG, value: producer.slug }]
    }

    const newPosts =
      await getPosts(page, order, filters)

    if (newPosts) {
      setPostsNumber(newPosts.postsNumber)
      setPosts(newPosts.posts.map((post) => {
        return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
      }))
    }
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new PostsPaginationQueryParams(query, configuration)

    const currentProducerSlug = queryParams.getFilter(PostFilterOptions.PRODUCER_SLUG)

    let currentProducer: ProducerComponentDto | null = allPostsProducerDto

    if (currentProducerSlug) {
      const foundProducer = producers.find((producer) => producer.slug === currentProducerSlug.value)

      if (foundProducer) {
        currentProducer = foundProducer
      } else {
        currentProducer = null
      }
    }

    const newPage = queryParams.page ?? configuration.page.defaultValue
    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue

    if (
      newPage === paginationState.page &&
      newOrder === paginationState.order &&
      currentProducer === paginationState.activeProducer
    ) {
      return
    }

    setPaginationState({ page: newPage, order: newOrder, activeProducer: currentProducer })

    updatePosts(newPage, newOrder, currentProducer)
  }, [query])

  let galleryTitle: string

  if (!paginationState.activeProducer) {
    galleryTitle = t('post_gallery_no_producer_title')
  } else {
    galleryTitle = paginationState.activeProducer.id === ''
      ? t('all_producers_title', { ns: 'home_page' })
      : paginationState.activeProducer.name
  }

  let content: ReactElement

  if (postsNumber === 0 && !loading) {
    content = (
      <EmptyState
        title={ t('post_gallery_empty_state_title') }
        subtitle={ t('post_gallery_empty_state_subtitle') }
      />
    )
  } else {
    content = (
      <PostCardGallery
        posts={ posts }
        postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        loading={ loading }
      />
    )
  }

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ paginationState.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ postsNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        activeProducer={ paginationState.activeProducer }
      />

      <GalleryHeader
        title={ galleryTitle }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
      />

      { content }

      <PaginationBar
        pageNumber={ paginationState.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        linkMode={ { ...linkMode, scrollOnClick: false } }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    </div>
  )
}
