import { FC, useEffect } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import {
  PaginatedPostCardGallerySSR
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallerySSR'

export interface Props {
  actorName: string
  actorId: string
  actorSlug: string
  posts: PostCardComponentDto[]
  postsNumber: number
  page: number
  order: PostsPaginationSortingType
}

export const Actor: FC<Props> = ({
  actorName,
  actorId,
  posts,
  postsNumber,
  page,
  order,
}) => {
  const { t } = useTranslation('actors')

  useEffect(() => {
    (new ActorsApiService()).addActorView(actorId)
      .then()
      .catch((exception) => console.error(exception))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const emptyState = (
    <EmptyState
      title={ t('actor_posts_empty_state_title') }
      subtitle={ t('actor_posts_empty_state_subtitle', { actorName }) }
    />
  )

  return (
    <PaginatedPostCardGallerySSR
      headerTag={ 'h1' }
      posts={ posts }
      postsNumber={ postsNumber }
      title={ 'actors:actor_posts_gallery_title' }
      subtitle={ t('actor_posts_gallery_posts_quantity', { postsNumber }) }
      term={ { title: 'actorName', value: actorName } }
      page={ page }
      order={ order }
      paginatedPostCardGalleryPostCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
      sortingOptions={ sortingOptions }
      emptyState={ emptyState }
    />
  )
}
