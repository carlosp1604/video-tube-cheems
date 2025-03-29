import { FC, useEffect } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { ProducerPageComponentDto } from '~/modules/Producers/Infrastructure/ProducerPageComponentDto'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { ProducersApiService } from '~/modules/Producers/Infrastructure/Frontend/ProducersApiService'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import {
  PaginatedPostCardGallerySSR
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallerySSR'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  producer: ProducerPageComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const Producer: FC<Props> = ({
  page,
  order,
  producer,
  posts,
  postsNumber,
}) => {
  const { t, lang } = useTranslation('producers')

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  useEffect(() => {
    (new ProducersApiService()).addProducerView(producer.id)
      .then()
      .catch((exception) => console.error(exception))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const emptyState = (
    <EmptyState
      title={ t('producer_posts_empty_state_title') }
      subtitle={ t('producer_posts_empty_state_subtitle', { producerName: producer.name }) }
    />
  )

  return (
    <PaginatedPostCardGallerySSR
      title={ 'producers:producer_posts_gallery_title' }
      subtitle={ t('producer_posts_gallery_posts_quantity',
        { postsNumber: NumberFormatter.compatFormat(postsNumber, lang) }) }
      term={ { title: 'producerName', value: producer.name } }
      headerTag={ 'h1' }
      page={ page }
      order={ order }
      posts={ posts }
      postsNumber={ postsNumber }
      sortingOptions={ sortingOptions }
      emptyState={ emptyState }
      paginatedPostCardGalleryPostCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
    />
  )
}
