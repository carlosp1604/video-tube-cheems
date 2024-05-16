import { FC, useEffect, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import {
  PaginatedPostCardGallery, PaginatedPostCardGalleryConfiguration
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export interface Props {
  actorName: string
  actorId: string
  actorSlug: string
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Actor: FC<Props> = ({
  actorName,
  actorId,
  actorSlug,
  initialPosts,
  initialPostsNumber,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('actors')

  useEffect(() => {
    try {
      (new ActorsApiService()).addActorView(actorId).then()
    } catch (exception: unknown) {
      console.error(exception)
    }
  }, [])

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.LATEST,
    PaginationSortingType.OLDEST,
    PaginationSortingType.MOST_VIEWED,
  ]

  const postCardOptions: PaginatedPostCardGalleryConfiguration[] = [{ type: 'savePost' }, { type: 'react' }]

  const emptyState = (
    <EmptyState
      title={ t('actor_posts_empty_state_title') }
      subtitle={ t('actor_posts_empty_state_subtitle', { actorName }) }
    />
  )

  return (
    <>
      <PaginatedPostCardGallery
        key={ locale }
        headerTag={ 'h1' }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
        title={ 'actors:actor_posts_gallery_title' }
        subtitle={ t('actor_posts_gallery_posts_quantity', { postsNumber }) }
        term={ { title: 'actorName', value: actorName } }
        page={ 1 }
        order={ PaginationSortingType.LATEST }
        filters={ [{ type: FilterOptions.ACTOR_SLUG, value: actorSlug }] }
        filtersToParse={ [FilterOptions.ACTOR_SLUG] }
        paginatedPostCardGalleryPostCardOptions={ postCardOptions }
        sortingOptions={ sortingOptions }
        defaultSortingOption={ PaginationSortingType.LATEST }
        onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
        emptyState={ emptyState }
      />
    </>
  )
}
