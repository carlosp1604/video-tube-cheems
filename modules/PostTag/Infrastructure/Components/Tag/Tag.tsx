import { FC, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useRouter } from 'next/router'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  PaginatedPostCardGallery
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { NumberFormatter } from '~/modules/Shared/Infrastructure/FrontEnd/NumberFormatter'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { TagPageComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagPageComponentDto'

export interface Props {
  initialPage: number
  initialOrder: PostsPaginationSortingType
  tag: TagPageComponentDto
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
}

export const Tag: FC<Props> = ({
  initialPage,
  initialOrder,
  tag,
  initialPosts,
  initialPostsNumber,
}) => {
  const [postsNumber, setPostsNumber] = useState<number>(initialPostsNumber)

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { t } = useTranslation('tags')

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

  const emptyState = (
    <EmptyState
      title={ t('tag_posts_empty_state_title') }
      subtitle={ t('tag_posts_empty_state_subtitle', { tagName: tag.name }) }
    />
  )

  return (
    <>
      <PaginatedPostCardGallery
        key={ locale }
        title={ 'tags:tag_posts_gallery_title' }
        subtitle={ t('tag_posts_gallery_posts_quantity',
          { postsNumber: NumberFormatter.compatFormat(postsNumber, locale) }) }
        term={ { title: 'tagName', value: tag.name } }
        headerTag={ 'h2' }
        page={ initialPage }
        order={ initialOrder }
        initialPosts={ initialPosts }
        initialPostsNumber={ initialPostsNumber }
        filters={ [{ type: FilterOptions.TAG_SLUG, value: tag.slug }] }
        filtersToParse={ [FilterOptions.TAG_SLUG] }
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
