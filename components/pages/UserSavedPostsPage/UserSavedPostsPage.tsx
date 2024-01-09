import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import { PostsPaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { PostCardOptionConfiguration } from '~/hooks/PostCardOptions'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { PostFilterOptions } from '~/modules/Shared/Infrastructure/PostFilterOptions'
import {
  UserProfileHeaderComponentDto
} from '~/modules/Auth/Infrastructure/ComponentDtos/UserProfileHeaderComponentDto'
import { UserProfileHeader } from '~/modules/Auth/Infrastructure/Components/UserProfileHeader/UserProfileHeader'
import {
  PostCardGalleryHeader
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryHeader'
import { useTranslation } from 'next-i18next'
import styles from './UserSavedPostsPage.module.scss'
import {
  UserSavedPostsEmptyState
} from '~/modules/Auth/Infrastructure/Components/UserSavedPostsEmptyState/UserSavedPostsEmptyState'
import { useSession } from 'next-auth/react'
import { EmptyState } from '~/components/EmptyState/EmptyState'

interface PaginationState {
  page: number
  order:PostsPaginationSortingType
}

export interface UserSavedPostsPageProps {
  userComponentDto: UserProfileHeaderComponentDto
}

export const UserSavedPostsPage: NextPage<UserSavedPostsPageProps> = ({ userComponentDto }) => {
  const [posts, setPosts] = useState<PostCardComponentDto[]>([])
  const [postsNumber, setPostsNumber] = useState<number>(0)

  const [paginationState, setPaginationState] = useState<PaginationState>({
    order: PostsPaginationSortingType.NEWEST_SAVED,
    page: 1,
  })

  const { t } = useTranslation('user_profile')
  const { status, data } = useSession()

  const [loading, setLoading] = useState(false)

  const locale = useRouter().locale ?? 'en'

  useEffect(() => {
    setLoading(true)
    updatePosts(paginationState.page, paginationState.order)
      .then(() => { setLoading(false) })
  }, [])

  const onDeleteSavedPost = (postId: string) => {
    const newPosts = posts.filter((post) => post.id !== postId)

    if (newPosts.length < posts.length) {
      setPostsNumber(postsNumber - 1)
    }

    setPosts(newPosts)
  }

  const postCardOptions: PostCardOptionConfiguration[] = [
    { type: 'deleteSavedPost', onDelete: onDeleteSavedPost, ownerId: userComponentDto.id },
    { type: 'react' },
  ]

  const sortingOptions: PostsPaginationSortingType[] = [
    PostsPaginationSortingType.NEWEST_SAVED,
    PostsPaginationSortingType.OLDEST_SAVED,
  ]

  const onChangeOption = async (newOrder: PostsPaginationSortingType) => {
    setLoading(true)
    setPaginationState({ ...paginationState, order: newOrder, page: 1 })

    await updatePosts(1, newOrder)

    setLoading(false)
  }

  const updatePosts = async (page:number, order: PostsPaginationSortingType) => {
    const componentOrder = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(order)

    try {
      const newPosts = await (new PostsApiService())
        .getSavedPosts(
          userComponentDto.id,
          page,
          defaultPerPage,
          componentOrder.criteria,
          componentOrder.option,
          [{ type: PostFilterOptions.SAVED_BY, value: userComponentDto.id }]
        )

      if (page === 1) {
        setPosts(newPosts.posts.map((post) => {
          return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
        }))
      } else {
        setPosts([
          ...posts,
          ...newPosts.posts.map((post) => {
            return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale ?? 'en')
          }),
        ])
      }

      setPostsNumber(newPosts.postsNumber)
    } catch (exception: unknown) {
      console.error(exception)
    }
  }

  const onEndGalleryReach = async () => {
    setLoading(true)
    setPaginationState({ ...paginationState, page: paginationState.page + 1 })
    await updatePosts(paginationState.page + 1, paginationState.order)
    setLoading(false)
  }

  let content: ReactElement

  if (postsNumber === 0 && !loading) {
    if (status === 'authenticated' && userComponentDto.id === data?.user.id) {
      content = (<UserSavedPostsEmptyState />)
    } else {
      content = (
        <EmptyState
          title={ t('saved_posts_empty_title') }
          subtitle={ t('saved_posts_empty_subtitle', { name: userComponentDto.name }) }
        />
      )
    }
  } else {
    content = (
      <InfiniteScroll
        next={ onEndGalleryReach }
        hasMore={ paginationState.page < PaginationHelper.calculatePagesNumber(postsNumber, defaultPerPage) }
        loader={ null }
        dataLength={ posts.length }
      >
        <PostCardGallery
          posts={ posts }
          postCardOptions={ postCardOptions }
          loading={ loading }
        />
      </InfiniteScroll>
    )
  }

  return (
    <div className={ styles.userSavedPostsPage__container }>
      <UserProfileHeader componentDto={ userComponentDto } />

      <PostCardGalleryHeader
        title={ t('user_saved_posts_title') }
        subtitle={ t('posts_number_title', { postsNumber }) }
        showSortingOptions={ postsNumber > defaultPerPage }
        activeOption={ paginationState.order }
        sortingOptions={ sortingOptions }
        onClickOption={ onChangeOption }
        loading={ loading }
      />

      { content }
    </div>
  )
}
