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
import { usePostCardOptions } from '~/hooks/PostCardOptions'
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
import { FetchPostsFilter, getFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PostsPaginationParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationParams'
import { PostsPaginationOrderType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationOrderType'

export interface Props {
  page: number
  order: PostsPaginationOrderType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
  initialFilter: FetchPostsFilter | null
}

export const HomePage: NextPage<Props> = ({
  initialPostsNumber,
  initialPosts,
  producers,
  activeProducer,
  page,
  order,
  initialFilter,
}) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>(initialPosts)
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const [producer, setProducer] = useState<ProducerComponentDto | null>(activeProducer)

  const [pagination, setPagination] = useState<PaginationStateInterface>({
    page,
    order,
    filters: initialFilter ? [initialFilter] : [],
  })

  const { t } = useTranslation(['home_page'])

  const router = useRouter()
  const { query, asPath } = router
  const locale = router.locale ?? 'en'

  const firstRender = useFirstRender()
  const updateQuery = useUpdateQuery()
  const buildOptions = usePostCardOptions()

  // TODO: Move into the postGallery component
  const postCardOptions = buildOptions([{ type: 'savePost' }, { type: 'react' }])

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

    const producerFilter = getFilter(PostFilterOptions.PRODUCER_SLUG, pagination.filters)

    const newPathname = PostsPaginationParams.buildPathname(
      pagination.page,
      1,
      pagination.order,
      PostsPaginationOrderType.LATEST,
      producerFilter ? producerFilter.value : null
    )

    if (newPathname !== asPath) {
      updateQuery(`/${locale}${newPathname}`)
    }
  }, [pagination])

  /** If queryParams are change externally, then we update state **/
  useEffect(() => {
    if (firstRender) { return }

    const params = new PostsPaginationParams(query, {
      filterParamType: {
        optional: true,
        defaultValue: allPostsProducerDto.slug,
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

    const producerFilter = pagination.filters.find((filter) => filter.type === PostFilterOptions.PRODUCER_SLUG)
    let producerSlug = allPostsProducerDto.slug

    if (producerFilter) {
      producerSlug = producerFilter.value
    }

    if (
      params.page !== pagination.page ||
      params.sortingOptionType !== pagination.order ||
      params.filterParamType !== producerSlug
    ) {
      let newProducer: ProducerComponentDto | null = allPostsProducerDto

      if (params.filterParamType !== allPostsProducerDto.slug) {
        const selectedProducer = producers.find((producer) => producer.slug === params.filterParamType)

        if (selectedProducer) {
          newProducer = selectedProducer
        } else {
          newProducer = null
        }
      }

      const newPaginationState = {
        page: params.page as number,
        order: params.sortingOptionType as PostsPaginationOrderType,
        filters: newProducer
          ? newProducer.slug === allPostsProducerDto.slug
            ? []
            : [{ type: PostFilterOptions.PRODUCER_SLUG, value: newProducer.slug }]
          : [],
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
            postCardOptions={ postCardOptions }
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
