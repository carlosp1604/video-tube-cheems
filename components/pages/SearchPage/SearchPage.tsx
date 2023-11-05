import styles from './SearchPage.module.scss'
import { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { PostFilterOptions } from '~/modules/Posts/Infrastructure/PostFilterOptions'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import {
  PaginatedPostCardGallery, PostCardGalleryAction, PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PaginatedPostCardGallery'
import { useTranslation } from 'next-i18next'
import {
  HomePostsDefaultSortingOption,
  HomePostsSortingOptions, SortingOption
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import toast from 'react-hot-toast'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { USER_USER_NOT_FOUND } from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { signOut, useSession } from 'next-auth/react'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { BiLike } from 'react-icons/bi'
import { BsBookmark } from 'react-icons/bs'

export interface SearchPageProps {
  posts: PostCardComponentDto[]
  postsNumber: number
  title: string
}

export const SearchPage: NextPage<SearchPageProps> = ({ posts, title, postsNumber }) => {
  const [titleFilter, setTitleFilter] = useState<FetchPostsFilter>({
    type: PostFilterOptions.POST_TITLE,
    value: title,
  })

  const { t } = useTranslation(['search', 'api_exceptions'])
  const { status, data } = useSession()

  const router = useRouter()

  if (router.query.search && router.query.search !== titleFilter.value) {
    setTitleFilter({
      ...titleFilter,
      value: router.query.search.toString(),
    })
  }

  let options: PostCardGalleryOption[] = []

  const savePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    try {
      await new PostsApiService().savePost(data.user.id, postId)

      toast.success(t('post_save_post_successfully_saved'))
    } catch (exception: unknown) {
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

  const likePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    try {
      await new PostsApiService().createPostReaction(postId, ReactionType.LIKE)

      toast.success(t('post_reaction_added_correctly_message'))
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

  if (status === 'authenticated' && data) {
    options = [
      {
        action: PostCardGalleryAction.NO_MUTATE,
        icon: <BiLike />,
        title: t('like_post_post_card_gallery_action_title'),
        onClick: (postId: string) => likePostPostCardAction(postId),
      },
      {
        action: PostCardGalleryAction.NO_MUTATE,
        icon: <BsBookmark />,
        title: t('save_post_post_card_gallery_action_title'),
        onClick: (postId: string) => savePostPostCardAction(postId),
      },
    ]
  }

  const fetchPosts = async (pageNumber: number, sortingOption: SortingOption, filters: FetchPostsFilter[]) => {
    return (new PostsApiService())
      .getPosts(
        pageNumber,
        defaultPerPage,
        sortingOption.criteria,
        sortingOption.option,
        filters
      )
  }

  return (
    <div className={ styles.searchPage__container }>
      <PaginatedPostCardGallery
        defaultSortingOption={ HomePostsDefaultSortingOption }
        sortingOptions={ HomePostsSortingOptions }
        initialPosts={ posts }
        initialPostsNumber={ postsNumber }
        filters={ [titleFilter] }
        title={ t('search_result_title', { searchTerm: title }) }
        fetchPosts={ fetchPosts }
        postCardOptions={ options }
        emptyState={ <EmptyState
          title={ t('result_posts_empty_state_title') }
          subtitle={ t('result_posts_empty_state_subtitle', { searchTerm: title }) }
        /> }
      />
    </div>
  )
}
