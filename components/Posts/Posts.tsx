import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import useTranslation from 'next-translate/useTranslation'
import styles from './Posts.module.scss'
import { ProducerList } from '~/modules/Producers/Infrastructure/Components/ProducerList/ProducerList'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { FC, ReactElement } from 'react'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'
import {
  PaginatedPostCardGallerySSR
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallerySSR'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  posts: PostCardComponentDto[]
  postsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
}

export const Posts: FC<Props> = ({
  postsNumber,
  posts,
  producers,
  page,
  order,
  activeProducer,
}) => {
  const { t, lang } = useTranslation('posts_page')

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const postCardOptions: PostCardOptionConfiguration[] = [{ type: 'savePost' }, { type: 'react' }]

  const emptyState: ReactElement = (
    <EmptyState
      title={ t('post_gallery_empty_state_title') }
      subtitle={ t('post_gallery_empty_state_subtitle') }
    />
  )

  let galleryTitle: string

  if (!activeProducer) {
    galleryTitle = t('post_gallery_no_producer_title')
  } else {
    if (activeProducer.id === '') {
      galleryTitle = t('all_producers_title')
    } else {
      galleryTitle = activeProducer.name
    }
  }

  return (
    <div className={ styles.posts__container }>
      <ProducerList
        producers={ producers }
        activeProducer={ activeProducer }
      />

      <PaginatedPostCardGallerySSR
        headerTag={ 'h1' }
        title={ galleryTitle }
        paginatedPostCardGalleryPostCardOptions={ postCardOptions }
        subtitle={ t('post_gallery_subtitle', { postsNumber: NumberFormatter.compatFormat(postsNumber, lang) }) }
        page={ page }
        order={ order }
        posts={ posts }
        postsNumber={ postsNumber }
        sortingOptions={ sortingOptions }
        emptyState={ emptyState }
        term={ undefined }
      />
    </div>
  )
}
