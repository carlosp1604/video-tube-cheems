import { FC, ReactElement, useState } from 'react'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import useTranslation from 'next-translate/useTranslation'
import styles from './UserSavedPosts.module.scss'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { useSession } from 'next-auth/react'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import {
  PaginatedPostCardGallery, PaginatedPostCardGalleryConfiguration
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'

export interface Props {
  userComponentDto: UserProfileHeaderComponentDto
}

export const UserSavedPosts: FC<Props> = ({ userComponentDto }) => {
  const [postsNumber, setPostsNumber] = useState<number>(0)

  const { t } = useTranslation('user_profile')
  const { status, data } = useSession()
  const locale = useRouter().locale ?? 'en'

  const customPostsFetcher = async (page:number, order: PostsPaginationSortingType, _filters: FetchPostsFilter[]) => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    try {
      return (new PostsApiService())
        .getSavedPosts(
          userComponentDto.id,
          page,
          defaultPerPage,
          componentOrder.criteria,
          componentOrder.option,
          [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
        )
    } catch (exception: unknown) {
      console.error(exception)

      return null
    }
  }

  const onDeleteSavedPost = (
    posts: PostCardComponentDto[],
    postId: string,
    setPosts: (posts: PostCardComponentDto[]) => void
  ) => {
    const newPosts = posts.filter((post) => post.id !== postId)

    if (newPosts.length < posts.length) {
      setPostsNumber(postsNumber - 1)
    }

    setPosts(newPosts)
  }

  const postCardOptions: PaginatedPostCardGalleryConfiguration[] = [
    { type: 'deleteSavedPost', onDelete: onDeleteSavedPost, ownerId: userComponentDto.id },
    { type: 'react' },
  ]

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.NEWEST_SAVED,
    PaginationSortingType.OLDEST_SAVED,
  ]

  let emptyState: ReactElement

  if (status === 'authenticated' && userComponentDto.id === data?.user.id) {
    emptyState = (<UserSavedPostsEmptyState />)
  } else {
    emptyState = (
      <EmptyState
        title={ t('saved_posts_empty_title') }
        subtitle={ t('saved_posts_empty_subtitle', { name: userComponentDto.name }) }
      />
    )
  }

  return (
    <div className={ styles.userSavedPosts__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <PaginatedPostCardGallery
        key={ locale }
        headerTag={ 'h2' }
        title={ t('user_saved_posts_title') }
        subtitle={ t('posts_number_title', { postsNumber }) }
        page={ 1 }
        order={ PaginationSortingType.NEWEST_SAVED }
        filters={ [] }
        filtersToParse={ [] }
        paginatedPostCardGalleryPostCardOptions={ postCardOptions }
        sortingOptions={ sortingOptions }
        defaultSortingOption={ PaginationSortingType.NEWEST_SAVED }
        onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
        emptyState={ emptyState }
        customPostsFetcher={ customPostsFetcher }
      />
    </div>
  )
}
