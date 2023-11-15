import { NextPage } from 'next'
import { useEffect, useMemo, useRef, useState } from 'react'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  HomePagePaginationOrderType,
  PostsPaginationOrderType,
  PostsPaginationQueryParams
} from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useQueryState } from 'next-usequerystate'
import { parseAsInteger, parseAsString } from 'next-usequerystate/parsers'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import { QueryItem, useUpdateQuery } from '~/hooks/UpdateQuery'
import { GalleryActionType, useGalleryAction } from '~/hooks/GalleryAction'
import {
  PostCardGallery,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
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

export interface Props {
  page: number
  order: PostsPaginationOrderType
  posts: PostCardComponentDto[]
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
  postsNumber: number
}

export const HomePage: NextPage<Props> = ({
  postsNumber,
  posts,
  producers,
  activeProducer,
  page,
  order,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(page)
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(postsNumber, defaultPerPage))
  const [currentPosts, setCurrentPosts] = useState<PostCardComponentDto[]>(posts)
  const [currentPostsNumber, setCurrentPostsNumber] = useState<number>(postsNumber)
  const [activeSortingOption, setActiveSortingOption] = useState<PostsPaginationOrderType>(order)
  const [currentProducer, setCurrentProducer] = useState<ProducerComponentDto | null>(activeProducer)
  const [queryParams, setQueryParams] = useState<QueryItem[]>([])

  /** Pagination and sorting query params **/
  const [pageQueryParam] = useQueryState('page', parseAsInteger.withDefault(1))
  const [orderQueryParam] = useQueryState('order', parseAsString.withDefault(PostsPaginationOrderType.NEWEST))
  const [filterQueryParam] = useQueryState('producerId', parseAsString.withDefault(''))

  const postGalleryRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation(['home_page', 'api_exceptions'])
  const { query, locale, asPath } = useRouter()

  const firstRender = useFirstRender()
  const updateQuery = useUpdateQuery()
  const getOptions = useGalleryAction()

  const postCardOptions: PostCardGalleryOption[] = getOptions(GalleryActionType.HOME_PAGE)
  const scrollToTop = () => { postGalleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  const onDeletePost = async (postId: string) => {
    const newPostsNumber = postsNumber - 1

    setCurrentPosts(currentPosts.filter((post) => post.id !== postId))
    setCurrentPostsNumber(currentPostsNumber - 1)

    if (currentPage > 1 && newPostsNumber % defaultPerPage === 0) {
      const newPageNumber = -1

      setCurrentPage(newPageNumber)
      setPagesNumber(pagesNumber - 1)

      await updatePosts(newPageNumber, activeSortingOption, currentProducer)

      setQueryParams([
        { key: 'page', value: String(newPageNumber) },
        { key: 'producerId', value: String(currentProducer?.id) },
        { key: 'order', value: String(activeSortingOption) },
      ])
    }
  }

  const onChangeProducer = async (producer: ProducerComponentDto) => {
    setCurrentProducer(producer)
    setCurrentPage(1)

    await updatePosts(1, activeSortingOption, producer.id === '' ? null : producer)

    setQueryParams([
      { key: 'producerId', value: String(producer.id) },
      { key: 'order', value: String(activeSortingOption) },
    ])
  }

  const onChangeSortingOption = async (option: PostsPaginationOrderType) => {
    setActiveSortingOption(option)
    setCurrentPage(1)

    await updatePosts(1, option, currentProducer)

    setQueryParams([
      { key: 'producerId', value: String(activeProducer?.id) },
      { key: 'order', value: String(option) },
    ])
  }

  const sortProducers = (activeProducer: ProducerComponentDto | null, producers: ProducerComponentDto[]) => {
    if (!activeProducer) {
      return producers
    }

    const producerIndex = producers.indexOf(activeProducer)

    if (producerIndex !== -1) {
      const updatedProducers = [...producers]

      updatedProducers.unshift(...updatedProducers.splice(producerIndex, 1))

      return updatedProducers
    }

    return producers
  }

  const sortedProducers = useMemo(() => sortProducers(currentProducer, producers), [currentProducer])

  const updatePosts = async (
    page: number,
    order: PostsPaginationOrderType,
    producer: ProducerComponentDto | null
  ) => {
    const componentSortingOption =
      PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(order as PostsPaginationOrderType)

    const newPosts = await (new PostsApiService()).getPosts(
      page,
      defaultPerPage,
      componentSortingOption.criteria,
      componentSortingOption.option,
      producer ? [{ value: producer.id, type: PostFilterOptions.PRODUCER_ID }] : []
    )

    setCurrentPosts(newPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
    }))
    setCurrentPostsNumber(newPosts.postsNumber)
    setPagesNumber(calculatePagesNumber(newPosts.postsNumber, defaultPerPage))
  }

  /** Make sure query params are updated when component has the correct state **/
  useEffect(() => {
    if (firstRender) { return }

    updateQuery(queryParams)
  }, [queryParams])

  /** If queryParams are change externally, then we update state **/
  useEffect(() => {
    if (firstRender) { return }

    if (
      pageQueryParam !== currentPage ||
      orderQueryParam !== activeSortingOption ||
      (currentProducer && filterQueryParam !== currentProducer.id)
    ) {
      let newProducer: ProducerComponentDto = allPostsProducerDto

      if (filterQueryParam !== '') {
        const selectedProducer = producers.find((producer) => producer.id === filterQueryParam)

        if (selectedProducer) {
          newProducer = selectedProducer
        }
      }

      updatePosts(pageQueryParam, orderQueryParam as PostsPaginationOrderType, newProducer)
        .then(() => {
          setCurrentPage(pageQueryParam)
          setActiveSortingOption(orderQueryParam as PostsPaginationOrderType)
          setCurrentProducer(newProducer)
        })
    }
  }, [query])

  let galleryTitle: string

  if (!currentProducer) {
    galleryTitle = 'NO HAY NADA QUE VER AAAAAAA'
  } else {
    galleryTitle = currentProducer.id === '' ? t('all_producers_title', { ns: 'home_page' }) : currentProducer.name
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        key={ asPath }
        producers={ sortedProducers }
        onChangeProducer={ onChangeProducer }
        activeProducer={ currentProducer }
      />

      { currentPostsNumber > 0
        ? <div ref={ postGalleryRef }>
          <PostCardGalleryHeader
            title={ galleryTitle }
            postsNumber={ currentPostsNumber }
            showSortingOptions={ postsNumber > defaultPerPage }
            activeOption={ activeSortingOption }
            sortingOptions={ HomePagePaginationOrderType }
            onChangeOption={ onChangeSortingOption }
          />

          <PostCardGallery
            posts={ currentPosts }
            postCardOptions={ postCardOptions }
            onClickDeleteOption={ onDeletePost }
          />

          <PaginationBar
            availablePages={ PaginationHelper.getShowablePages(currentPage, pagesNumber) }
            pageNumber={ currentPage }
            onPageNumberChange={ async (newPageNumber) => {
              setCurrentPage(newPageNumber)
              await updatePosts(newPageNumber, activeSortingOption, currentProducer)
              scrollToTop()

              setQueryParams([
                { key: 'page', value: String(newPageNumber) },
                { key: 'producerId', value: String(activeProducer?.id) },
                { key: 'order', value: String(activeSortingOption) },
              ])
            } }
            pagesNumber={ pagesNumber }
          />
        </div>
        : <EmptyState
            title={ 'Mi loco, aqui ni hay nada que ver' }
            subtitle={ 'Esto te pasa por meco' }
          />
      }

    </div>
  )
}
