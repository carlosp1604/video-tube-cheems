import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useRouter } from 'next/router'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import useTranslation from 'next-translate/useTranslation'
import { ProducerPageComponentDto } from '~/modules/Producers/Infrastructure/ProducerPageComponentDto'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { ProducersApiService } from '~/modules/Producers/Infrastructure/Frontend/ProducersApiService'
import {
  PaginatedPostCardGallery
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'

export interface Props {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  producer: ProducerPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Producer: FC<Props> = ({
  initialPage,
  initialOrder,
  producer,
  initialPosts,
  initialPostsNumber,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('producers')

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

  useEffect(() => {
    try {
      (new ProducersApiService()).addProducerView(producer.id)
    } catch (exception: unknown) {
      console.error(exception)
    }
  }, [])

  const emptyState = (
    <EmptyState
      title={ t('producer_posts_empty_state_title') }
      subtitle={ t('producer_posts_empty_state_subtitle', { producerName: producer.name }) }
    />
  )

  return (
    <>
      <PaginatedPostCardGallery
        key={ locale }
        title={ 'producers:producer_posts_gallery_title' }
        subtitle={ t('producer_posts_gallery_posts_quantity',
          { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        term={ { title: 'producerName', value: producer.name } }
        headerTag={ 'h2' }
        page={ initialPage }
        order={ initialOrder }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
        filters={ [{ type: PostFilterOptions.PRODUCER_SLUG, value: producer.slug }] }
        filtersToParse={ [PostFilterOptions.PRODUCER_SLUG] }
        paginatedPostCardGalleryPostCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        linkMode={ linkMode }
        sortingOptions={ sortingOptions }
        defaultSortingOption={ PaginationSortingType.LATEST }
        onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
        emptyState={ emptyState }
        onPaginationStateChanges={ undefined }
      />
    </>
  )
}
