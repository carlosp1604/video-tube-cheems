import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import styles from './Home.module.scss'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList/ProducerList'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { FC, ReactElement, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/Frontend/PostFilterOptions'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  PaginatedPostCardGallery, PaginatedPostCardGalleryConfiguration
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FetchFilter } from '~/modules/Shared/Infrastructure/FrontEnd/FetchFilter'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
}

export const Home: FC<Props> = ({
  initialPostsNumber,
  initialPosts,
  producers,
  page,
  order,
  activeProducer,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)
  const { t } = useTranslation('home_page')
  const router = useRouter()
  const locale = router.locale ?? 'en'

  const [selectedProducer, setSelectedProducer] = useState<ProducerComponentDto | null>(activeProducer)

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

  const postCardOptions: PaginatedPostCardGalleryConfiguration[] = [{ type: 'savePost' }, { type: 'react' }]

  const emptyState: ReactElement = (
    <EmptyState
      title={ t('post_gallery_empty_state_title') }
      subtitle={ t('post_gallery_empty_state_subtitle') }
    />
  )

  const onFetchNewPosts = (filters: FetchFilter<PostFilterOptions>[]) => {
    const producerFilter = filters.find((filter) =>
      filter.type === FilterOptions.PRODUCER_SLUG
    )

    if (!producerFilter) {
      setSelectedProducer(allPostsProducerDto)

      return
    }

    const foundProducer = producers.find((producer) => producer.slug === producerFilter.value)

    if (foundProducer) {
      setSelectedProducer(foundProducer)
    } else {
      setSelectedProducer(null)
    }
  }

  let galleryTitle: string

  if (!selectedProducer) {
    galleryTitle = t('post_gallery_no_producer_title')
  } else {
    if (selectedProducer.id === '') {
      galleryTitle = t('all_producers_title')
    } else {
      galleryTitle = selectedProducer.name
    }
  }

  // FIXME: Find the way to pass the default producer's name translated from serverside
  return (
    <div className={ styles.home__container }>
      <ProducerList
        producers={ producers }
        activeProducer={ selectedProducer }
      />

      <PaginatedPostCardGallery
        headerTag={ 'h1' }
        key={ locale }
        title={ galleryTitle }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        page={ page }
        order={ order }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
        filters={ !activeProducer || activeProducer.slug === allPostsProducerDto.slug
          ? []
          : [{ type: FilterOptions.PRODUCER_SLUG, value: activeProducer.slug }] }
        filtersToParse={ [FilterOptions.PRODUCER_SLUG] }
        paginatedPostCardGalleryPostCardOptions={ postCardOptions }
        linkMode={ linkMode }
        sortingOptions={ sortingOptions }
        defaultSortingOption={ PaginationSortingType.LATEST }
        onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
        emptyState={ emptyState }
        onPaginationStateChanges={ (_page, _order, filters) => onFetchNewPosts(filters) }
      />
    </div>
  )
}
