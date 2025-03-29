import { FC } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import {
  PaginatedPostCardGallerySSR
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallerySSR'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  tagName: string
  tagSlug: string
  posts: PostCardComponentDto[]
  postsNumber: number
}

export const Tag: FC<Props> = ({
  page,
  order,
  tagName,
  posts,
  postsNumber,
}) => {
  const { t, lang } = useTranslation('tags')

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const emptyState = (
    <EmptyState
      title={ t('tag_posts_empty_state_title') }
      subtitle={ t('tag_posts_empty_state_subtitle', { tagName }) }
    />
  )

  return (
    <PaginatedPostCardGallerySSR
      title={ 'tags:tag_posts_gallery_title' }
      subtitle={ t('tag_posts_gallery_posts_quantity',
        { postsNumber: NumberFormatter.compatFormat(postsNumber, lang) }) }
      term={ { title: 'tagName', value: tagName } }
      headerTag={ 'h1' }
      page={ page }
      order={ order }
      posts={ posts }
      postsNumber={ postsNumber }
      paginatedPostCardGalleryPostCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      sortingOptions={ sortingOptions }
      emptyState={ emptyState }
    />
  )
}
