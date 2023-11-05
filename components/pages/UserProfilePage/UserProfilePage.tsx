import { NextPage } from 'next'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  PaginatedPostCardGallery,
  PostCardGalleryAction,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import {
  SavedPostsDefaultSortingOption,
  SavePostsSortingOptions, SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { useTranslation } from 'next-i18next'
import styles from './UserProfilePage.module.scss'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { signOut, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { BsTrash } from 'react-icons/bs'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { USER_USER_NOT_FOUND } from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { EmptyState } from '~/components/EmptyState/EmptyState'

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
  posts: PostCardComponentDto[]
  postsNumber: number
}
export const UserProfilePage: NextPage<UserProfilePageProps> = ({
  userComponentDto,
  posts,
  postsNumber,
}) => {
  const { t } = useTranslation(['user_profile', 'api_exceptions'])

  const { status, data } = useSession()

  let options: PostCardGalleryOption[] = []

  const deleteSavedPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'user_profile' }))

      return
    }

    try {
      await new PostsApiService().removeFromSavedPosts(data.user.id, postId)

      toast.success(t('post_save_post_successfully_removed_from_saved_post', { ns: 'user_profile' }))
    } catch (exception) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  if (status === 'authenticated' && data && userComponentDto.id === data.user.id) {
    options = [{
      action: PostCardGalleryAction.DELETE,
      icon: <BsTrash />,
      title: t('delete_saved_post_option_title', { ns: 'user_profile' }),
      onClick: (postId: string) => deleteSavedPostCardAction(postId),
    }]
  }

  const fetchPosts = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getSavedPosts(
        userComponentDto.id,
        pageNumber,
        defaultPerPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <div className={ styles.userProfilePage__userPosts }>
        <PaginatedPostCardGallery
          title={ t('user_saved_posts_title', { ns: 'user_profile' }) }
          initialPosts={ posts }
          initialPostsNumber={ postsNumber }
          filters={ [{
            type: PostFilterOptions.SAVED_BY,
            value: userComponentDto.id,
          }] }
          sortingOptions={ SavePostsSortingOptions }
          postCardOptions={ options }
          defaultSortingOption={ SavedPostsDefaultSortingOption }
          fetchPosts={ fetchPosts }
          emptyState={ data && data.user.id === userComponentDto.id
            ? <UserSavedPostsEmptyState />
            : <EmptyState
              title={ t('saved_posts_empty_title', { ns: 'user_profile' }) }
              subtitle={ t('saved_posts_empty_subtitle', { name: userComponentDto.name, ns: 'user_profile' }) }
            />
          }
        />
      </div>
    </div>
  )
}
