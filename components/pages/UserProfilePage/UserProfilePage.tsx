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
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { BsTrash } from 'react-icons/bs'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'

export interface UserProfilePageProps {
  userComponentDto: UserProfileHeaderComponentDto
  posts: PostCardComponentDto[]
  postsNUmber: number
}
export const UserProfilePage: NextPage<UserProfilePageProps> = ({
  userComponentDto,
  posts,
  postsNUmber,
}) => {
  const { t } = useTranslation('user_profile')

  const { status, data } = useSession()

  let options: PostCardGalleryOption[] = []

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

  const deleteSavedPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error('Necesitas iniciar sesión')

      return
    }

    try {
      const response = await new PostsApiService().removeFromSavedPosts(data.user.id, postId)

      if (!response.ok) {
        console.log(response)
        toast.error('asdasdasdas')

        return
      }

      toast.success('Borrado correctamente ;)')
    } catch (exception) {
      toast.error('Server error')
    }
  }

  if (status === 'authenticated' && data && userComponentDto.id === data.user.id) {
    options = [{
      action: PostCardGalleryAction.DELETE,
      icon: <BsTrash />,
      title: 'Eliminar post guardado',
      onClick: (postId: string) => deleteSavedPostCardAction(postId),
    }]
  }

  return (
    <div className={ styles.userProfilePage__container }>
      <UserProfileHeader
        componentDto={ userComponentDto }
      />

      <div className={ styles.userProfilePage__userPosts }>
        <PaginatedPostCardGallery
          title={ t('user_saved_posts_title') }
          initialPosts={ posts }
          initialPostsNumber={ postsNUmber }
          filters={ [{
            type: PostFilterOptions.SAVED_BY,
            value: userComponentDto.id,
          }] }
          sortingOptions={ SavePostsSortingOptions }
          postCardOptions={ options }
          defaultSortingOption={ SavedPostsDefaultSortingOption }
          fetchPosts={ fetchPosts }
        />
      </div>
    </div>
  )
}
