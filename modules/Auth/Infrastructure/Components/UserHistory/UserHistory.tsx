import { FC, ReactElement, useState } from 'react'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import useTranslation from 'next-translate/useTranslation'
import styles from './UserHistory.module.scss'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useSession } from 'next-auth/react'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  PaginatedPostCardGallery, PaginatedPostCardGalleryConfiguration
} from '~/modules/Shared/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import { useRouter } from 'next/router'

export interface Props {
  userComponentDto: UserProfileHeaderComponentDto
}

export const UserHistory: FC<Props> = ({ userComponentDto }) => {
  const [postsNumber, setPostsNumber] = useState<number>(0)

  const { t } = useTranslation('user_profile')
  const { status, data } = useSession()
  const locale = useRouter().locale ?? 'en'

  const postCardOptions: PaginatedPostCardGalleryConfiguration[] = [
    { type: 'savePost' },
    { type: 'react' },
  ]

  const sortingOptions: PostsPaginationSortingType[] = [
    PaginationSortingType.NEWEST_VIEWED,
    PaginationSortingType.OLDEST_VIEWED,
  ]

  const customPostsFetcher = async (page:number, order: PostsPaginationSortingType, _filters: FetchPostsFilter[]) => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    try {
      return (new PostsApiService())
        .getUserHistory(
          userComponentDto.id,
          page,
          defaultPerPage,
          componentOrder.criteria,
          componentOrder.option,
          [{ type: PostFilterOptions.VIEWED_BY, value: userComponentDto.id }]
        )
    } catch (exception: unknown) {
      console.error(exception)

      return null
    }
  }

  let emptyState: ReactElement

  if (status === 'authenticated' && data && data.user.id === userComponentDto.id) {
    emptyState = (
      <EmptyState
        title={ t('own_history_empty_title') }
        subtitle={ t('own_history_empty_subtitle') }
      />
    )
  } else {
    emptyState = (
      <EmptyState
        title={ t('history_empty_title') }
        subtitle={ t('history_empty_subtitle', { name: userComponentDto.name }) }
      />
    )
  }

  return (
    <div className={ styles.userHistory__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <PaginatedPostCardGallery
        headerTag={ 'h2' }
        key={ locale }
        title={ t('user_history_title') }
        subtitle={ t('posts_number_title', { postsNumber }) }
        page={ 1 }
        order={ PaginationSortingType.NEWEST_VIEWED }
        filters={ [] }
        filtersToParse={ [] }
        paginatedPostCardGalleryPostCardOptions={ postCardOptions }
        sortingOptions={ sortingOptions }
        defaultSortingOption={ PaginationSortingType.NEWEST_VIEWED }
        onPostsFetched={ (postsNumber, _posts) => setPostsNumber(postsNumber) }
        emptyState={ emptyState }
        customPostsFetcher={ customPostsFetcher }
      />
    </div>
  )
}
