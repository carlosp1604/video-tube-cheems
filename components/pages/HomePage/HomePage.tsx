import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  HomePagePaginationOrderType,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import { useUpdateQuery } from '~/hooks/UpdateQuery'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import styles from '~/components/pages/HomePage/HomePage.module.scss'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { PaginationStateInterface } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationStateInterface'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationOrderType'

export interface Props {
  page: number
  order: PostsPaginationOrderType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  producers: ProducerComponentDto[]
  initialProducerFilter: FetchPostsFilter
}

export const HomePage: NextPage<Props> = ({
  initialPostsNumber,
  initialPosts,
  producers,
  page,
  order,
  initialProducerFilter,
}) => {
  const getProducer = (producerSlug: string): ProducerComponentDto | null => {
    let newProducer: ProducerComponentDto | null = allPostsProducerDto

    if (producerSlug !== allPostsProducerDto.slug) {
      const selectedProducer = producers.find((producer) => producer.slug === producerSlug)

      if (selectedProducer) {
        newProducer = selectedProducer
      } else {
        newProducer = null
      }

      return newProducer
    }

    return newProducer
  }
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const [producer, setProducer] = useState<ProducerComponentDto | null>(getProducer(initialProducerFilter.value))

  const [pagination, setPagination] =
    useState<PaginationStateInterface>({ page, order, filters: [initialProducerFilter] })

  const { t } = useTranslation(['home_page'])
  const router = useRouter()
  const { query } = router
  const locale = router.locale ?? 'en'

  const firstRender = useFirstRender()
  const updateQuery = useUpdateQuery()

  const scrollToTop = () => { window.scrollTo({ behavior: 'smooth', top: 0 }) }

  // TODO: This makes no sense here
  const onDeletePost = async (postId: string) => {
    const newPostsNumber = initialPostsNumber - 1

    setPosts(posts.filter((post) => post.id !== postId))
    setPostsNumber(postsNumber - 1)

    if (pagination.page > 1 && newPostsNumber % defaultPerPage === 0) {
      const newPageNumber = -1

      setPagination({
        ...pagination,
        page: newPageNumber,
      })
    }
  }

  const onChangeProducer = async (newProducer: ProducerComponentDto) => {
    const newPaginationState = {
      order: PostsPaginationOrderType.LATEST,
      page: 1,
      filters: newProducer.slug === allPostsProducerDto.slug
        ? []
        : [{ type: PostFilterOptions.PRODUCER_SLUG, value: newProducer.slug }],
    }

    setProducer(newProducer)
    setPagination(newPaginationState)

    await updatePosts(newPaginationState)
  }

  const onChangeSortingOption = async (option: PostsPaginationOrderType) => {
    const newPaginationState = { ...pagination, page: 1, order: option }

    setPagination(newPaginationState)

    await updatePosts(newPaginationState)
  }

  const updatePosts = async (pagination: PaginationStateInterface) => {
    const componentSortingOption =
      PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(pagination.order)

    const activeProducer = pagination.filters.find((filter) => filter.type === PostFilterOptions.PRODUCER_SLUG)

    if (activeProducer && !getProducer(activeProducer.value)) {
      setPosts([])
      setPostsNumber(0)

      return
    }

    const newPosts = await (new PostsApiService()).getPosts(
      pagination.page,
      defaultPerPage,
      componentSortingOption.criteria,
      componentSortingOption.option,
      pagination.filters
    )

    setPosts(newPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
    }))
    setPostsNumber(newPosts.postsNumber)
  }

  useEffect(() => {
    if (firstRender) { return }

    const newQuery = PostsPaginationQueryParams.buildQuery(
      String(pagination.page),
      '1',
      pagination.order,
      PostsPaginationOrderType.LATEST,
      pagination.filters
    )

    updateQuery(newQuery)
  }, [pagination])

  useEffect(() => {
    if (firstRender) { return }

    const queryParams = new PostsPaginationQueryParams(
      query,
      {
        filters: { filtersToParse: [PostFilterOptions.PRODUCER_SLUG] },
        sortingOptionType: {
          defaultValue: PostsPaginationOrderType.LATEST,
          parseableOptionTypes: [
            PostsPaginationOrderType.LATEST,
            PostsPaginationOrderType.OLDEST,
            PostsPaginationOrderType.MOST_VIEWED,
          ],
        },
        page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
      }
    )

    // Get producer value from current state
    const producerFilter = pagination.filters.find((filter) => filter.type === PostFilterOptions.PRODUCER_SLUG)
    let producerSlug = allPostsProducerDto.slug

    if (producerFilter) {
      producerSlug = producerFilter.value
    }

    // Get producer value from query
    const queryProducerFilter = queryParams.getFilter(PostFilterOptions.PRODUCER_SLUG)
    let queryProducer = allPostsProducerDto.slug

    if (queryProducerFilter) {
      queryProducer = queryProducerFilter.value
    }

    // Update posts if queryState is not equal to current component state
    if (
      queryParams.page !== pagination.page ||
      queryParams.sortingOptionType !== pagination.order ||
      queryProducer !== producerSlug
    ) {
      let newProducer: ProducerComponentDto | null = allPostsProducerDto

      if (queryProducer !== allPostsProducerDto.slug) {
        const selectedProducer = producers.find((producer) => producer.slug === queryProducer)

        if (selectedProducer) {
          newProducer = selectedProducer
        } else {
          newProducer = null
        }
      }

      const newPaginationState = {
        page: queryParams.page as number,
        order: queryParams.sortingOptionType as PostsPaginationOrderType,
        filters: newProducer && newProducer.slug === allPostsProducerDto.slug
          ? []
          : [{ type: PostFilterOptions.PRODUCER_SLUG, value: queryProducer }],
      }

      setPagination(newPaginationState)
      setProducer(newProducer)

      updatePosts(newPaginationState)
    }
  }, [query])

  let galleryTitle: string

  if (!producer) {
    galleryTitle = t('post_gallery_no_producer_title')
  } else {
    galleryTitle = producer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : producer.name
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        onChangeProducer={ onChangeProducer }
        activeProducer={ producer }
      />

      { postsNumber > 0
        ? <>
          <PostCardGalleryHeader
            title={ galleryTitle }
            subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
            showSortingOptions={ postsNumber > defaultPerPage }
            activeOption={ pagination.order }
            sortingOptions={ HomePagePaginationOrderType }
            onChangeOption={ onChangeSortingOption }
          />

          <PostCardGallery
            posts={ posts }
            postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
          />

          <PaginationBar
            availablePages={ PaginationHelper.getShowablePages(
              pagination.page,
              calculatePagesNumber(postsNumber, defaultPerPage)
            ) }
            pageNumber={ pagination.page }
            onPageNumberChange={ async (newPageNumber) => {
              const newPaginationState = { ...pagination, page: newPageNumber }

              setPagination(newPaginationState)

              await updatePosts(newPaginationState)
              scrollToTop()
            } }
            pagesNumber={ calculatePagesNumber(postsNumber, defaultPerPage) }
          />
        </>
        : <EmptyState
          title={ t('post_gallery_empty_state_title') }
          subtitle={ t('post_gallery_empty_state_subtitle') }
        />
      }

    </div>
  )
}
